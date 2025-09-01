export const SUBSCRIPTION_PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    credits: 10,
    popular: false,
    features: [
      '10 AI generations per month',
      'Basic image sizes',
      'Standard processing speed',
      'Community support',
      'Basic templates'
    ],
    stripePriceId: null,
    tier: 'FREE' as const
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 9.99,
    credits: 100,
    popular: true,
    features: [
      '100 AI generations per month',
      'All image sizes & formats',
      'Priority processing',
      'Email support',
      'Premium templates',
      'Advanced editing tools',
      'Commercial usage rights'
    ],
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID,
    tier: 'PRO' as const
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 29.99,
    credits: 500,
    popular: false,
    features: [
      '500 AI generations per month',
      'All premium features',
      'Fastest processing',
      'Priority support',
      'Custom templates',
      'API access',
      'Team collaboration',
      'Advanced analytics'
    ],
    stripePriceId: process.env.STRIPE_ENTERPRISE_PRICE_ID,
    tier: 'ENTERPRISE' as const
  }
] as const;

export const CREDIT_PACKAGES = [
  {
    id: 'credits-10',
    name: '10 Credits',
    credits: 10,
    price: 4.99,
    stripePriceId: process.env.STRIPE_CREDITS_10_PRICE_ID,
    popular: false
  },
  {
    id: 'credits-25',
    name: '25 Credits',
    credits: 25,
    price: 9.99,
    stripePriceId: process.env.STRIPE_CREDITS_25_PRICE_ID,
    popular: true,
    bonus: 5 // 5 bonus credits
  },
  {
    id: 'credits-50',
    name: '50 Credits',
    credits: 50,
    price: 19.99,
    stripePriceId: process.env.STRIPE_CREDITS_50_PRICE_ID,
    popular: false,
    bonus: 15 // 15 bonus credits
  },
  {
    id: 'credits-100',
    name: '100 Credits',
    credits: 100,
    price: 34.99,
    stripePriceId: process.env.STRIPE_CREDITS_100_PRICE_ID,
    popular: false,
    bonus: 35 // 35 bonus credits
  }
] as const;

export const ASSET_TEMPLATES = [
  {
    id: 'portrait',
    name: 'Portrait',
    category: 'photography',
    description: 'Professional portrait photography style',
    imageSize: 'portrait_4_3'
  },
  {
    id: 'landscape',
    name: 'Landscape',
    category: 'photography',
    description: 'Wide scenic landscape format',
    imageSize: 'landscape_16_9'
  },
  {
    id: 'square',
    name: 'Square',
    category: 'social',
    description: 'Perfect for social media posts',
    imageSize: 'square_1_1'
  },
  {
    id: 'banner',
    name: 'Banner',
    category: 'marketing',
    description: 'Website header or promotional banner',
    imageSize: 'banner_3_1'
  },
  {
    id: 'story',
    name: 'Story',
    category: 'social',
    description: 'Vertical format for stories',
    imageSize: 'story_9_16'
  }
] as const;

export const IMAGE_SIZES = {
  'square_1_1': { width: 1024, height: 1024 },
  'portrait_3_4': { width: 768, height: 1024 },
  'portrait_4_5': { width: 800, height: 1000 },
  'landscape_16_9': { width: 1920, height: 1080 },
  'landscape_4_3': { width: 1200, height: 900 },
  'banner_3_1': { width: 1800, height: 600 },
  'story_9_16': { width: 720, height: 1280 }
} as const;

export const SUBSCRIPTION_TIER_LIMITS = {
  FREE: {
    monthlyCredits: 10,
    maxGenerationsPerDay: 5,
    maxImageSize: 'square_hd',
    features: ['basic_templates', 'standard_processing']
  },
  PRO: {
    monthlyCredits: 100,
    maxGenerationsPerDay: 50,
    maxImageSize: 'any',
    features: ['premium_templates', 'priority_processing', 'commercial_rights', 'advanced_editing']
  },
  ENTERPRISE: {
    monthlyCredits: 500,
    maxGenerationsPerDay: 200,
    maxImageSize: 'any',
    features: ['all_templates', 'fastest_processing', 'api_access', 'team_collaboration', 'analytics']
  }
} as const;