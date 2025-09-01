'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  CreditCard, 
  Calendar, 
  Zap, 
  Settings, 
  Loader2,
  TrendingUp,
  Gift
} from 'lucide-react';
import { toast } from 'sonner';
import { SUBSCRIPTION_PLANS } from '@/lib/constants';
import { CreditPurchase } from './credit-purchase';

interface UserStats {
  user: {
    id: string;
    subscription: 'FREE' | 'PRO' | 'ENTERPRISE';
    creditsUsed: number;
    creditsLimit: number;
    subscriptionStatus?: string;
    subscriptionPeriodEnd?: string;
  };
  totalGenerations: number;
  thisMonthGenerations: number;
}

interface SubscriptionManagementProps {
  userStats: UserStats;
  onRefresh: () => void;
}

export function SubscriptionManagement({ userStats, onRefresh }: SubscriptionManagementProps) {
  const [loading, setLoading] = useState(false);
  const [showCreditPurchase, setShowCreditPurchase] = useState(false);

  const { user } = userStats;
  const currentPlan = SUBSCRIPTION_PLANS.find(p => p.tier === user.subscription);
  const creditsUsedPercentage = (user.creditsUsed / user.creditsLimit) * 100;

  const handleManageBilling = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to create portal session');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Portal error:', error);
      toast.error('Failed to open billing portal');
    } finally {
      setLoading(false);
    }
  };

  if (showCreditPurchase) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Purchase Credits</h2>
          <Button 
            variant="outline" 
            onClick={() => setShowCreditPurchase(false)}
          >
            Back to Dashboard
          </Button>
        </div>
        <CreditPurchase />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Current Plan
            </CardTitle>
            <Badge variant={user.subscription === 'FREE' ? 'secondary' : 'default'}>
              {currentPlan?.name}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Monthly Price</span>
            <span className="font-medium">
              ${currentPlan?.price || 0}/month
            </span>
          </div>
          
          {user.subscriptionPeriodEnd && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Next Billing</span>
              <span className="font-medium flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(user.subscriptionPeriodEnd).toLocaleDateString()}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status</span>
            <Badge variant={user.subscriptionStatus === 'active' ? 'default' : 'secondary'}>
              {user.subscriptionStatus || 'Active'}
            </Badge>
          </div>

          {user.subscription !== 'FREE' && (
            <Button
              onClick={handleManageBilling}
              disabled={loading}
              className="w-full"
              variant="outline"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Settings className="mr-2 h-4 w-4" />
                  Manage Billing
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Credit Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2" />
            Credit Usage
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Credits Used</span>
              <span className="font-medium">
                {user.creditsUsed} / {user.creditsLimit}
              </span>
            </div>
            <Progress value={creditsUsedPercentage} className="h-2" />
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {userStats.totalGenerations}
              </div>
              <div className="text-sm text-muted-foreground">
                Total Generated
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {userStats.thisMonthGenerations}
              </div>
              <div className="text-sm text-muted-foreground">
                This Month
              </div>
            </div>
          </div>

          <Button
            onClick={() => setShowCreditPurchase(true)}
            className="w-full"
            variant="outline"
          >
            <Gift className="mr-2 h-4 w-4" />
            Buy More Credits
          </Button>
        </CardContent>
      </Card>

      {/* Upgrade Suggestion */}
      {user.subscription === 'FREE' && creditsUsedPercentage > 70 && (
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center text-primary">
              <TrendingUp className="h-5 w-5 mr-2" />
              Upgrade Recommended
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              You&apos;re running low on credits! Upgrade to Pro for 100 monthly credits and priority processing.
            </p>
            <Button className="w-full">
              Upgrade to Pro - $9.99/month
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}