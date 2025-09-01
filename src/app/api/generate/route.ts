import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { falAI, ModelId, AI_MODELS } from '@/lib/fal-client';
import { getCurrentUserFromDB, updateUserCredits, saveGeneration } from '@/lib/user-service';

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const {
            prompt,
            negativePrompt,
            imageSize = 'square_hd',
            numImages = 1,
            style,
            seed,
            modelId = 'flux-schnell' as ModelId,
            imageUrls // New parameter for image editing
        } = body;

        if (!prompt) {
            return NextResponse.json(
                { error: 'Prompt is required' },
                { status: 400 }
            );
        }

        // Get user from database
        const user = await getCurrentUserFromDB();
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Determine credits needed based on model and presence of imageUrls
        const creditsNeeded = falAI.getModelCredits(modelId); // Credits are per call for editing models

        if (user.creditsUsed + creditsNeeded > user.creditsLimit) {
            return NextResponse.json(
                { error: 'Insufficient credits' },
                { status: 403 }
            );
        }

        // Enhance prompt with style
        const enhancedPrompt = style ? `${prompt}, ${style} style` : prompt;

        let result;
        if (modelId === 'nano-banana' && imageUrls && imageUrls.length > 0) {
            // For Nano Banana, convert base64 to proper URLs if needed
            const processedImageUrls = await Promise.all(
                imageUrls.map(async (imageUrl) => {
                    if (imageUrl.startsWith('data:')) {
                        // Convert base64 to blob and upload to a temporary storage
                        // For now, we'll pass the base64 directly and handle it in fal-client
                        return imageUrl;
                    }
                    return imageUrl;
                })
            );

            // Image editing
            result = await falAI.generateImage({
                prompt: enhancedPrompt,
                negative_prompt: negativePrompt,
                image_urls: processedImageUrls,
            }, modelId);
        } else {
            // Image generation
            result = await falAI.generateImage({
                prompt: enhancedPrompt,
                negative_prompt: negativePrompt,
                image_size: imageSize,
                num_images: numImages,
                guidance_scale: 3.5,
                num_inference_steps: 4,
                seed: seed
            }, modelId);
        }

        // Save generations to database
        const savedGenerations = await Promise.all(
            result.images.map(async (image) => {
                // Handle different response formats for different models
                const width = image.width || (modelId === 'nano-banana' ? 1024 : 1024);
                const height = image.height || (modelId === 'nano-banana' ? 1024 : 1024);
                
                return await saveGeneration({
                    userId: user.id,
                    prompt: enhancedPrompt,
                    negativePrompt,
                    imageUrl: image.url,
                    imageSize: imageSize,
                    style,
                    width,
                    height,
                    seed: result.seed,
                    modelUsed: AI_MODELS[modelId as ModelId].id,
                    creditsUsed: falAI.getModelCredits(modelId),
                });
            })
        );

        // Update user credits
        await updateUserCredits(user.id, creditsNeeded);

        return NextResponse.json({
            ...result,
            generations: savedGenerations,
            creditsUsed: creditsNeeded,
        });
    } catch (error) {
        console.error('Generation error:', error);
        return NextResponse.json(
            { error: 'Failed to generate image' },
            { status: 500 }
        );
    }
}

import { NextResponse } from 'next/server';
import { fal } from '@fal-ai/serverless';
import { getAuth } from '@clerk/nextjs/server';
import { UserService } from '@/lib/user-service';

// Configure FAL on the server side
fal.config({
  credentials: process.env.FAL_KEY,
});

export interface GenerateRequest {
  prompt: string;
  negative_prompt?: string;
  image_size?: 'square' | 'portrait' | 'landscape' | 'square_hd';
  width?: number;
  height?: number;
  num_images?: number;
  modelId?: string;
  image_urls?: string[];
  guidance_scale?: number;
  num_inference_steps?: number;
  seed?: number;
  enable_safety_checker?: boolean;
}

const AI_MODELS = {
  'flux-schnell': {
    id: 'fal-ai/flux/schnell',
    name: 'FLUX Schnell',
    description: 'Fast, high-quality image generation',
    credits: 1,
  },
  'flux-dev': {
    id: 'fal-ai/flux/dev',
    name: 'FLUX Dev',
    description: 'Higher quality, slower generation',
    credits: 2,
  },
  'stable-diffusion': {
    id: 'fal-ai/stable-diffusion-v3-medium',
    name: 'Stable Diffusion v3',
    description: 'Versatile image generation',
    credits: 1,
  },
  'nano-banana': {
    id: 'fal-ai/nano-banana',
    name: 'Nano Banana',
    description: 'Advanced image editing and transformation',
    credits: 3,
  },
} as const;

export async function POSTSecure(req: Request) {
  try {
    const { userId } = getAuth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json() as GenerateRequest;
    const { 
      prompt, 
      modelId = 'flux-schnell', 
      image_urls,
      ...rest 
    } = body;

    // Validate model
    const model = AI_MODELS[modelId as keyof typeof AI_MODELS];
    if (!model) {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid model ID' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check user credits
    const userService = new UserService();
    const hasEnoughCredits = await userService.hasEnoughCredits(userId, model.credits);
    if (!hasEnoughCredits) {
      return new NextResponse(
        JSON.stringify({ error: 'Insufficient credits' }), 
        { status: 402, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Prepare the input for FAL
    const input: any = {
      prompt,
      negative_prompt: rest.negative_prompt || '',
      image_size: rest.image_size || 'square',
      width: rest.width || 1024,
      height: rest.height || 1024,
      num_images: rest.num_images || 1,
      guidance_scale: rest.guidance_scale ?? 3.5,
      num_inference_steps: rest.num_inference_steps ?? 4,
      seed: rest.seed,
      enable_safety_checker: rest.enable_safety_checker ?? true,
    };

    // Add image_urls if present (for editing)
    if (image_urls && image_urls.length > 0) {
      input.image_urls = image_urls;
    }

    // Call FAL API
    const result = await fal.subscribe(model.id, {
      input,
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === 'IN_PROGRESS') {
          console.log('Generation in progress...', update.logs);
        }
      },
    });

    // Deduct credits on success
    await userService.deductCredits(userId, model.credits, {
      prompt,
      model: modelId,
      width: rest.width,
      height: rest.height,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Generation error:', error);
    return new NextResponse(
      JSON.stringify({ 
        error: 'Failed to generate image',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined 
      }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}