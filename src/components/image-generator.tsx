'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Loader2, Download, Wand2, Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import Link from 'next/link';
import { AI_MODELS, ModelId } from '@/lib/fal-client';
import type { GenerationRequest, GeneratedImage } from '@/types';

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

const SUGGESTED_PROMPTS = [
  "A serene mountain landscape at golden hour",
  "Modern minimalist interior design",
  "Abstract colorful digital art",
  "Professional portrait photography"
];

const EDITING_PROMPTS = [
  "Make it look like a vintage photograph",
  "Transform into a watercolor painting",
  "Add dramatic lighting and shadows",
  "Convert to black and white with high contrast"
];

export function ImageGenerator() {
  const { isSignedIn } = useUser();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [request, setRequest] = useState<GenerationRequest>({
    prompt: '',
    negativePrompt: 'blurry, low quality, distorted, ugly',
    imageSize: 'square_hd',
    numImages: 1,
    style: 'Photorealistic'
  });
  const [selectedModel, setSelectedModel] = useState<ModelId>('flux-schnell');
  
  const isEditingMode = selectedModel === 'nano-banana';
  const [userStats, setUserStats] = useState<{
    creditsUsed: number;
    creditsLimit: number;
    tier: string;
  } | null>(null);

  useEffect(() => {
    if (isSignedIn) {
      fetchUserStats();
    }
  }, [isSignedIn]);

  const fetchUserStats = async () => {
    try {
      const response = await fetch('/api/user');
      if (!response.ok) {
        throw new Error('Failed to fetch user stats');
      }
      const data = await response.json();
      if (data) {
        setUserStats({
          creditsUsed: data.creditsUsed || 0,
          creditsLimit: data.creditsLimit || 10,
          tier: data.tier || 'FREE'
        });
      }
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
      toast.error('Failed to load user data');
    }
  };

  const handleGenerate = async () => {
    if (!isSignedIn) {
      toast.error('Please sign in to generate images');
      return;
    }

    if (!userStats) {
      toast.error('Loading user data, please try again');
      return;
    }

    let imageUrls: string[] | undefined;
    if (isEditingMode) {
      if (!uploadedImage) {
        toast.error('Please upload an image to edit with Nano Banana.');
        return;
      }
      // For Nano Banana, we need to upload the image first to get a URL
      // For now, we'll convert to base64 and handle the conversion in the API
      imageUrls = [await fileToBase64(uploadedImage)];
    }

    if (!request.prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    const creditsNeeded = request.numImages * AI_MODELS[selectedModel].credits;
    if (userStats.creditsUsed + creditsNeeded > userStats.creditsLimit) {
      toast.error('Insufficient credits. Please upgrade your plan.');
      return;
    }

    setIsGenerating(true);
    toast.loading(isEditingMode ? 'Editing your image...' : 'Generating your AI image...', { id: 'generation' });

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: request.prompt,
          negativePrompt: request.negativePrompt,
          imageSize: request.imageSize,
          numImages: request.numImages,
          style: request.style,
          seed: request.seed,
          modelId: selectedModel,
          imageUrls: imageUrls
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate image');
      }

      const result = await response.json();

      const newImages: GeneratedImage[] = result.images.map((img: Record<string, unknown>, index: number) => ({
        id: result.generations[index].id,
        url: img.url as string,
        prompt: request.prompt,
        width: img.width as number,
        height: img.height as number,
        createdAt: new Date()
      }));

      setGeneratedImages(prev => [...newImages, ...prev]);
      toast.success(`Successfully ${isEditingMode ? 'edited' : 'generated'} ${newImages.length} image${newImages.length > 1 ? 's' : ''}! Used ${result.creditsUsed} credits.`, { id: 'generation' });
      
      // Refresh user stats
      fetchUserStats();
    } catch (error: unknown) {
      console.error('Generation failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate image. Please try again.';
      toast.error(errorMessage, { id: 'generation' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async (imageUrl: string, prompt: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `imaginex-${prompt.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '-')}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Image downloaded!');
    } catch (error) {
      toast.error('Failed to download image');
    }
  };

  if (!isSignedIn) {
    return (
      <section className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <Sparkles className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-bold mb-2">Create with AI</h2>
          <p className="text-muted-foreground mb-6">
            Sign in to start generating images
          </p>
          <div className="space-y-3">
            <Link href="/sign-up">
              <Button className="w-full">Get Started</Button>
            </Link>
            <Link href="/sign-in">
              <Button variant="outline" className="w-full">Sign In</Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center py-8">
      <div className="w-full max-w-4xl mx-auto px-4">

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            {isEditingMode ? 'AI Image Editor' : 'AI Image Generator'}
          </h1>
          <p className="text-muted-foreground mb-8">
            {isEditingMode 
              ? 'Transform and edit your images with AI' 
              : 'Transform your ideas into stunning visuals'
            }
          </p>
          {userStats && (
            <Badge variant="outline" className="mt-4">
              {userStats.creditsUsed}/{userStats.creditsLimit} credits used
            </Badge>
          )}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Text Input Section - Main Focus */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-xl p-6 border shadow-sm">
              <div className="space-y-4">
                <Textarea
                  placeholder={isEditingMode 
                    ? "Describe how you want to edit or transform the uploaded image..." 
                    : "Describe the image you want to create..."
                  }
                  value={request.prompt}
                  onChange={(e) => setRequest(prev => ({ ...prev, prompt: e.target.value }))}
                  className="min-h-[120px] text-base resize-none border-2 focus:border-primary/50 transition-colors"
                />
                
                {/* Quick Suggestions */}
                <div className="flex flex-wrap gap-2">
                  {(isEditingMode ? EDITING_PROMPTS : SUGGESTED_PROMPTS).map((prompt, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className="text-xs h-8 px-3 bg-muted/50 hover:bg-muted"
                      onClick={() => setRequest(prev => ({ ...prev, prompt }))}
                    >
                      {prompt}
                    </Button>
                  ))}
                </div>

                {/* Generate Button */}
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || !request.prompt.trim()}
                  size="lg"
                  className="w-full h-12 text-base"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      {isEditingMode ? 'Editing...' : 'Generating...'}
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-5 w-5" />
                      {isEditingMode ? 'Edit Image' : 'Generate Image'}
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Generated Images Display */}
            <div className="space-y-4">
              {generatedImages.length === 0 ? (
                <div className="bg-muted/20 rounded-xl p-12 text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-muted/50 rounded-full flex items-center justify-center">
                    <Sparkles className="h-10 w-10 text-muted-foreground/50" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Ready to create</h3>
                  <p className="text-muted-foreground">Enter a prompt above to generate your first image</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {generatedImages.map((image) => (
                    <div key={image.id} className="bg-card rounded-xl p-4 border shadow-sm">
                      <div className="relative mb-3">
                        <Image
                          src={image.url}
                          alt={image.prompt}
                          width={image.width}
                          height={image.height}
                          className="w-full rounded-lg"
                          unoptimized
                        />
                        <Button
                          size="sm"
                          className="absolute top-3 right-3"
                          onClick={() => handleDownload(image.url, image.prompt)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">{image.prompt}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Settings Sidebar */}
          <div className="space-y-8">
            <div className="bg-card rounded-xl p-4 border shadow-sm">
              <h3 className="font-medium mb-4">Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Model</label>
                  <Select
                    value={selectedModel}
                    onValueChange={(value: ModelId) => {
                      setSelectedModel(value);
                      // Clear uploaded image when switching away from editing mode
                      if (value !== 'nano-banana') {
                        setUploadedImage(null);
                      }
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a model">
                        <span>{AI_MODELS[selectedModel]?.name || 'Select a model'}</span>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(AI_MODELS).map(([key, model]) => (
                        <SelectItem key={key} value={key} className="group hover:bg-accent data-[highlighted]:bg-accent">
                          <div className="flex flex-col py-1.5 px-4">
                            <span className="group-hover:text-primary-foreground group-hover:font-bold">{model.name} (<span className="text-muted-foreground group-hover:text-primary-foreground group-hover:font-medium">{model.credits} credits</span>)</span>
                            <span className="text-xs text-muted-foreground group-hover:text-primary-foreground group-hover:font-medium">{model.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {isEditingMode && (
                    <div className="mt-2 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-md border border-amber-200 dark:border-amber-800">
                      <p className="text-xs text-amber-800 dark:text-amber-200">
                        <strong>Nano Banana Mode:</strong> This model specializes in editing and transforming existing images. Upload an image above and describe how you want to modify it.
                      </p>
                    </div>
                  )}
                </div>

                {!isEditingMode && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Size</label>
                    <Select
                      value={request.imageSize}
                      onValueChange={(value: GenerationRequest['imageSize']) => setRequest(prev => ({ ...prev, imageSize: value }))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select image size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="square_hd">Square HD (1024×1024)</SelectItem>
                        <SelectItem value="portrait_4_3">Portrait (768×1024)</SelectItem>
                        <SelectItem value="landscape_4_3">Landscape (1024×768)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {isEditingMode && (
                  <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-4 w-4 text-blue-600" />
                      <label className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        Upload Image to Edit (Required)
                      </label>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      onChange={(e) => setUploadedImage(e.target.files ? e.target.files[0] : null)}
                    />
                    {uploadedImage && (
                      <div className="mt-3">
                        <p className="text-sm text-muted-foreground mb-2">
                          Selected: {uploadedImage.name}
                        </p>
                        <Image
                          src={URL.createObjectURL(uploadedImage)}
                          alt="Uploaded preview"
                          width={128}
                          height={128}
                          className="max-h-32 rounded-md object-cover border"
                          unoptimized
                        />
                      </div>
                    )}
                  </div>
                )}

                {!isEditingMode && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Upload Image (Optional)</label>
                    <input
                      type="file"
                      accept="image/*"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      onChange={(e) => setUploadedImage(e.target.files ? e.target.files[0] : null)}
                    />
                    {uploadedImage && (
                      <div className="mt-2 text-sm text-muted-foreground">
                        Selected: {uploadedImage.name}
                        <Image
                          src={URL.createObjectURL(uploadedImage)}
                          alt="Uploaded preview"
                          width={128}
                          height={128}
                          className="mt-2 max-h-32 rounded-md object-cover"
                          unoptimized
                        />
                      </div>
                    )}
                  </div>
                )}

                {!isEditingMode && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Number of Images</label>
                    <Select
                      value={request.numImages.toString()}
                      onValueChange={(value) => setRequest(prev => ({ ...prev, numImages: parseInt(value) }))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select number of images" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} image{num > 1 ? 's' : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}