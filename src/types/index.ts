export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  width: number;
  height: number;
  createdAt: Date;
  userId?: string;
}

export interface GenerationRequest {
  prompt: string;
  negativePrompt?: string;
  imageSize: 'square' | 'portrait' | 'landscape' | 'square_hd';
  numImages: number;
  style?: string;
  seed?: number;
  imageUrls?: string[];
}

export interface User {
  id: string;
  clerkId: string;
  email: string;
  name: string | null;
  imageUrl: string | null;
  subscription: SubscriptionTier;
  creditsUsed: number;
  creditsLimit: number;
  createdAt: Date;
  updatedAt: Date;
}

export type SubscriptionTier = 'free' | 'pro' | 'enterprise';

export interface SubscriptionPlan {
  id: SubscriptionTier;
  name: string;
  price: number;
  credits: number;
  features: string[];
  popular?: boolean;
}

export interface AssetTemplate {
  id: string;
  name: string;
  category: 'social-media' | 'product-mockup' | 'ad-creative' | 'landing-page';
  description: string;
  prompt: string;
  imageSize: GenerationRequest['imageSize'];
  style: string;
  thumbnail: string;
}