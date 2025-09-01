'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Zap, Gift } from 'lucide-react';
import { toast } from 'sonner';
import { CREDIT_PACKAGES } from '@/lib/constants';

export function CreditPurchase() {
  const [loading, setLoading] = useState<string | null>(null);

  const handlePurchase = async (packageId: string) => {
    setLoading(packageId);
    
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'credits',
          planId: packageId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Purchase error:', error);
      toast.error('Failed to start purchase process');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Buy Credits</h2>
        <p className="text-muted-foreground">
          Purchase additional credits to generate more AI images
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {CREDIT_PACKAGES.map((pkg) => (
          <Card 
            key={pkg.id} 
            className={`relative ${pkg.popular ? 'border-primary/50 shadow-lg' : ''}`}
          >
            {pkg.popular && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">
                Most Popular
              </Badge>
            )}
            
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center mb-2">
                <Zap className="h-6 w-6 text-primary mr-2" />
                <CardTitle className="text-lg">{pkg.name}</CardTitle>
              </div>
              
              <div className="space-y-1">
                <div className="text-2xl font-bold">${pkg.price}</div>
                <div className="text-sm text-muted-foreground">
                  {pkg.credits} credits
                  {pkg.bonus && (
                    <div className="flex items-center justify-center mt-1 text-green-600">
                      <Gift className="h-3 w-3 mr-1" />
                      +{pkg.bonus} bonus
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <Button
                className="w-full"
                onClick={() => handlePurchase(pkg.id)}
                disabled={loading === pkg.id}
                variant={pkg.popular ? 'default' : 'outline'}
              >
                {loading === pkg.id ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Buy Credits'
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center text-sm text-muted-foreground">
        <p>Credits never expire • Secure payment via Stripe • Instant delivery</p>
      </div>
    </div>
  );
}