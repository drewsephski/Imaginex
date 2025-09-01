import { fal } from "@fal-ai/client";

// Configure fal client
fal.config({
    credentials: process.env.NEXT_PUBLIC_FAL_KEY || process.env.FAL_KEY,
    endpoint: 'https://api.fal.ai/v1', // Update the endpoint to use the secure API
});

export interface FalImageGenerationInput {
    prompt: string;
    negative_prompt?: string;
    image_size?: 'square' | 'portrait' | 'landscape' | 'square_hd';
    width?: number;
    height?: number;
    num_images?: number;
    image_urls?: string[];
    modelId?: string;
    guidance_scale?: number;
    num_inference_steps?: number;
    seed?: number;
    enable_safety_checker?: boolean;
}

export interface FalImageResult {
    images: Array<{
        url: string;
        width: number;
        height: number;
        content_type: string;
    }>;
    seed?: number; // Made optional as edit models might not return it
    has_nsfw_concepts?: boolean[]; // Made optional
    prompt?: string; // Made optional
    description?: string; // Added for image editing models
}

export const AI_MODELS = {
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

export type ModelId = keyof typeof AI_MODELS;

export class FalAIService {
    private static instance: FalAIService;

    static getInstance(): FalAIService {
        if (!FalAIService.instance) {
            FalAIService.instance = new FalAIService();
        }
        return FalAIService.instance;
    }

    private async fetchFromApi<T>(endpoint: string, data: any): Promise<T> {
        const response = await fetch(`/api/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.error || 'Failed to process request');
        }

        return response.json();
    }

    async generateImage(
        input: FalImageGenerationInput, 
        modelId: ModelId = 'flux-schnell'
    ): Promise<FalImageResult> {
        try {
            const model = AI_MODELS[modelId];
            if (!model) {
                throw new Error(`Model ${modelId} not found`);
            }
            
            // Call our secure API endpoint
            const result = await this.fetchFromApi<FalImageResult>('generate', {
                ...input,
                modelId,
            });

            // Type assertion with proper error handling
            const typedResult = result as unknown as FalImageResult;

            // Handle different response formats for different models
            if (modelId === 'nano-banana') {
                // Nano Banana edit endpoint returns: { data: { images: [{ url: string }], description: string } }
                const nanoBananaResult = result as any;

                console.log("Nano Banana raw result:", JSON.stringify(nanoBananaResult, null, 2));

                let images: Array<{ url: string, width: number, height: number, content_type: string }> = [];
                let description = '';

                // Handle nested data structure (most common)
                if (nanoBananaResult.data?.images && Array.isArray(nanoBananaResult.data.images)) {
                    images = nanoBananaResult.data.images.map((img: any) => ({
                        url: img.url,
                        width: img.width || 1024, // Default dimensions for Nano Banana
                        height: img.height || 1024,
                        content_type: img.content_type || 'image/jpeg'
                    }));
                    description = nanoBananaResult.data.description || '';
                }
                // Handle direct structure
                else if (nanoBananaResult.images && Array.isArray(nanoBananaResult.images)) {
                    images = nanoBananaResult.images.map((img: any) => ({
                        url: img.url,
                        width: img.width || 1024, // Default dimensions for Nano Banana
                        height: img.height || 1024,
                        content_type: img.content_type || 'image/jpeg'
                    }));
                    description = nanoBananaResult.description || '';
                }
                // Handle standard FalImageResult format (fallback)
                else if (typedResult.images && Array.isArray(typedResult.images) && typedResult.images.length > 0) {
                    return typedResult;
                } else {
                    console.error("Unexpected Nano Banana response format:", nanoBananaResult);
                    throw new Error("Invalid response format from Nano Banana API");
                }

                return {
                    images,
                    description,
                    seed: typedResult.seed,
                    has_nsfw_concepts: typedResult.has_nsfw_concepts,
                    prompt: typedResult.prompt,
                };
            } else {
                // Standard format for other models
                if (!typedResult.images && !typedResult.description) {
                    throw new Error("Invalid response format from FAL API: Missing images or description.");
                }
            }

            return typedResult;
        } catch (error) {
            console.error('Generation error:', error);
            throw new Error(error instanceof Error ? error.message : 'Failed to generate image');
        }
    }

    getModelCredits(modelId: ModelId): number {
        return AI_MODELS[modelId].credits;
    }

    getAllModels() {
        return AI_MODELS;
    }
}

export const falAI = FalAIService.getInstance();