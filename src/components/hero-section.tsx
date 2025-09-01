'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Sparkles, Zap, Palette } from 'lucide-react';

export function HeroSection() {
  return (
    <div className="h-full flex items-center justify-center py-8">
      <div className="max-w-5xl mx-auto px-4 w-full text-center">
        <Badge className="mb-6">
          <Sparkles className="h-3 w-3 mr-1" />
          AI-Powered Marketing Assets
        </Badge>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-foreground">
          Create Studio-Quality
          <br />
          Marketing Assets
          <br />
          <span className="text-4xl md:text-6xl">in Seconds</span>
        </h1>
        
        <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          Generate professional social media posts, product mockups, ad creatives, and landing page visuals
          with AI. No design expertise required.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button size="lg">
            Start Creating Free
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline">
            View Examples
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="flex flex-col items-center p-6 bg-card/60 backdrop-blur-sm rounded-xl border">
            <Zap className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-foreground">Lightning Fast</h3>
            <p className="text-muted-foreground text-center">Generate professional assets in under 10 seconds</p>
          </div>
          
          <div className="flex flex-col items-center p-6 bg-card/60 backdrop-blur-sm rounded-xl border">
            <Palette className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-foreground">Brand Consistent</h3>
            <p className="text-muted-foreground text-center">Maintain your brand identity across all assets</p>
          </div>
          
          <div className="flex flex-col items-center p-6 bg-card/60 backdrop-blur-sm rounded-xl border">
            <Sparkles className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-foreground">AI-Powered</h3>
            <p className="text-muted-foreground text-center">Advanced AI models for stunning visual results</p>
          </div>
        </div>
      </div>
    </div>
  );
}