import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { SUBSCRIPTION_PLANS, CREDIT_PACKAGES } from '@/lib/constants';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = (await headers()).get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionChange(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCanceled(subscription);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.subscription) {
          await handleSubscriptionRenewal(invoice);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const { userId, type, credits, bonus } = session.metadata || {};

  if (!userId) {
    console.error('No userId in session metadata');
    return;
  }

  if (type === 'credits') {
    // Handle credit purchase
    const creditsToAdd = parseInt(credits || '0') + parseInt(bonus || '0');
    
    await prisma.$transaction([
      // Add credits to user
      prisma.user.update({
        where: { id: userId },
        data: {
          creditsLimit: {
            increment: creditsToAdd,
          },
        },
      }),
      // Record the purchase
      prisma.creditPurchase.create({
        data: {
          userId,
          credits: creditsToAdd,
          amount: (session.amount_total || 0) / 100, // Convert from cents
          stripePaymentIntentId: session.payment_intent as string,
          status: 'completed',
        },
      }),
    ]);
  } else if (type === 'subscription') {
    // Handle subscription - this will be processed in subscription.created event
    console.log('Subscription checkout completed, waiting for subscription.created event');
  }
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  
  // Find user by customer ID
  const user = await prisma.user.findFirst({
    where: { customerId },
  });

  if (!user) {
    console.error('User not found for customer:', customerId);
    return;
  }

  // Determine subscription tier from price ID
  const priceId = subscription.items.data[0]?.price.id;
  const plan = SUBSCRIPTION_PLANS.find(p => p.stripePriceId === priceId);
  
  if (!plan) {
    console.error('Plan not found for price ID:', priceId);
    return;
  }

  // Update user subscription
  await prisma.user.update({
    where: { id: user.id },
    data: {
      subscription: plan.tier,
      subscriptionId: subscription.id,
      subscriptionStatus: subscription.status,
      subscriptionPeriodEnd: new Date(subscription.current_period_end * 1000),
      creditsLimit: plan.credits,
      creditsUsed: 0, // Reset credits on subscription change
      lastCreditReset: new Date(),
    },
  });
}

async function handleSubscriptionCanceled(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  
  const user = await prisma.user.findFirst({
    where: { customerId },
  });

  if (!user) {
    console.error('User not found for customer:', customerId);
    return;
  }

  // Downgrade to free plan
  await prisma.user.update({
    where: { id: user.id },
    data: {
      subscription: 'FREE',
      subscriptionId: null,
      subscriptionStatus: 'canceled',
      subscriptionPeriodEnd: null,
      creditsLimit: 10, // Free tier limit
      creditsUsed: Math.min(user.creditsUsed, 10), // Cap at free limit
    },
  });
}

async function handleSubscriptionRenewal(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  
  const user = await prisma.user.findFirst({
    where: { customerId },
  });

  if (!user) {
    console.error('User not found for customer:', customerId);
    return;
  }

  // Reset monthly credits
  const plan = SUBSCRIPTION_PLANS.find(p => p.tier === user.subscription);
  if (plan) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        creditsUsed: 0,
        creditsLimit: plan.credits,
        lastCreditReset: new Date(),
      },
    });
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  
  const user = await prisma.user.findFirst({
    where: { customerId },
  });

  if (!user) {
    console.error('User not found for customer:', customerId);
    return;
  }

  // Update subscription status
  await prisma.user.update({
    where: { id: user.id },
    data: {
      subscriptionStatus: 'past_due',
    },
  });

  // TODO: Send email notification about failed payment
}