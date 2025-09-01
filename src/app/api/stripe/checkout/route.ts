import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { stripe, createCheckoutSession, getStripeCustomerByEmail, createStripeCustomer } from '@/lib/stripe';
import { getCurrentUserFromDB } from '@/lib/user-service';
import { SUBSCRIPTION_PLANS, CREDIT_PACKAGES } from '@/lib/constants';
import { prisma } from '@/lib/prisma';

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
    const { type, planId } = body; // type: 'subscription' | 'credits'

    const user = await getCurrentUserFromDB();
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get or create Stripe customer
    let customer = await getStripeCustomerByEmail(user.email);
    if (!customer) {
      customer = await createStripeCustomer(user.email, user.name || undefined);
    }

    // Update user with customer ID if not already set
    if (!user.customerId) {
      await prisma.user.update({
        where: { id: user.id },
        data: { customerId: customer.id },
      });
    }

    let priceId: string;
    let metadata: Record<string, string> = {
      userId: user.id,
      type,
    };

    if (type === 'subscription') {
      const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
      if (!plan || !plan.stripePriceId) {
        return NextResponse.json(
          { error: 'Invalid subscription plan' },
          { status: 400 }
        );
      }
      priceId = plan.stripePriceId;
      metadata.planId = planId;
    } else if (type === 'credits') {
      const creditPackage = CREDIT_PACKAGES.find(p => p.id === planId);
      if (!creditPackage || !creditPackage.stripePriceId) {
        return NextResponse.json(
          { error: 'Invalid credit package' },
          { status: 400 }
        );
      }
      priceId = creditPackage.stripePriceId;
      metadata.credits = creditPackage.credits.toString();
      metadata.bonus = (creditPackage.bonus || 0).toString();
    } else {
      return NextResponse.json(
        { error: 'Invalid type' },
        { status: 400 }
      );
    }

    const session = await createCheckoutSession({
      customerId: customer.id,
      priceId,
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      metadata,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}