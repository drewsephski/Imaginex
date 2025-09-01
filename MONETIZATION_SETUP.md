# Monetization Setup Guide

This guide will help you set up the complete monetization system for your AI image generation app.

## 🚀 Features Added

- **Subscription Management**: Free, Pro, and Enterprise tiers
- **Credit System**: Purchase additional credits
- **Stripe Integration**: Secure payment processing
- **User Dashboard**: Subscription and usage management
- **Webhook Handling**: Automatic subscription updates

## 📋 Prerequisites

1. **Stripe Account**: Sign up at [stripe.com](https://stripe.com)
2. **Database**: PostgreSQL database (local or hosted)
3. **Environment Variables**: Configure all required variables

## 🔧 Setup Steps

### 1. Database Setup

First, ensure your database is running and update your `.env.local`:

```bash
# Copy from .env.example and fill in your values
cp .env.example .env.local
```

Update `DATABASE_URL` in `.env.local`:
```
DATABASE_URL="postgresql://username:password@localhost:5432/imaginex?schema=public"
```

Then push the database schema:
```bash
npx prisma db push
npx prisma generate
```

### 2. Stripe Configuration

#### A. Get Stripe Keys
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Get your **Publishable Key** and **Secret Key** from API Keys section
3. Add them to `.env.local`:

```env
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

#### B. Create Products and Prices
In your Stripe Dashboard, create these products:

**Subscription Products:**
1. **Pro Plan** - $9.99/month recurring
2. **Enterprise Plan** - $29.99/month recurring

**One-time Credit Products:**
1. **10 Credits** - $4.99 one-time
2. **25 Credits** - $9.99 one-time  
3. **50 Credits** - $19.99 one-time
4. **100 Credits** - $34.99 one-time

Copy the Price IDs and add them to `.env.local`:
```env
STRIPE_PRO_PRICE_ID=price_...
STRIPE_ENTERPRISE_PRICE_ID=price_...
STRIPE_CREDITS_10_PRICE_ID=price_...
STRIPE_CREDITS_25_PRICE_ID=price_...
STRIPE_CREDITS_50_PRICE_ID=price_...
STRIPE_CREDITS_100_PRICE_ID=price_...
```

#### C. Set up Webhooks
1. In Stripe Dashboard, go to **Webhooks**
2. Add endpoint: `https://yourdomain.com/api/stripe/webhook`
3. Select these events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

4. Copy the webhook secret and add to `.env.local`:
```env
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 3. App URL Configuration

Add your app URL to `.env.local`:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000  # or your production URL
```

### 4. Test the Setup

1. **Start the development server:**
```bash
npm run dev
```

2. **Test subscription flow:**
   - Go to `/pricing`
   - Click "Upgrade to Pro"
   - Complete test payment with card `4242 4242 4242 4242`

3. **Test credit purchase:**
   - Go to `/dashboard`
   - Click "Settings" tab
   - Click "Buy More Credits"
   - Complete test payment

4. **Verify webhooks:**
   - Check Stripe Dashboard webhook logs
   - Verify user subscription updates in database

## 🎯 Usage

### For Users
- **Free Plan**: 10 credits/month
- **Pro Plan**: 100 credits/month + premium features
- **Enterprise Plan**: 500 credits/month + all features
- **Credit Purchases**: Buy additional credits anytime

### For Admins
- Monitor subscriptions in Stripe Dashboard
- View user analytics in database
- Manage pricing and products in Stripe

## 🔒 Security Notes

1. **Never expose secret keys** in client-side code
2. **Validate webhooks** using Stripe signatures
3. **Use HTTPS** in production
4. **Regularly rotate** API keys

## 🚀 Production Deployment

1. **Update environment variables** with production values
2. **Switch to live Stripe keys** (remove `_test_` from keys)
3. **Update webhook endpoint** to production URL
4. **Test payment flow** thoroughly

## 📊 Analytics & Monitoring

Track these metrics:
- Monthly Recurring Revenue (MRR)
- Customer Lifetime Value (CLV)
- Churn rate
- Credit usage patterns
- Popular subscription tiers

## 🛠️ Customization

### Adding New Subscription Tiers
1. Update `SUBSCRIPTION_PLANS` in `src/lib/constants.ts`
2. Create new product in Stripe
3. Add price ID to environment variables
4. Update Prisma enum if needed

### Modifying Credit Packages
1. Update `CREDIT_PACKAGES` in `src/lib/constants.ts`
2. Create new products in Stripe
3. Add price IDs to environment variables

### Custom Features per Tier
Update `SUBSCRIPTION_TIER_LIMITS` in `src/lib/constants.ts` to add:
- API access limits
- Advanced features
- Priority processing
- Custom integrations

## 🐛 Troubleshooting

### Common Issues

1. **Webhook not receiving events**
   - Check webhook URL is accessible
   - Verify webhook secret matches
   - Check Stripe Dashboard logs

2. **Payment not updating user**
   - Verify webhook events are configured
   - Check database connection
   - Review server logs

3. **Subscription not activating**
   - Ensure customer ID is saved
   - Check subscription status in Stripe
   - Verify webhook processing

### Debug Commands

```bash
# Check database connection
npx prisma studio

# View webhook logs
tail -f logs/webhook.log

# Test Stripe connection
node -e "console.log(require('./src/lib/stripe').stripe.apiVersion)"
```

## 📞 Support

For issues with this monetization system:
1. Check the troubleshooting section above
2. Review Stripe Dashboard for payment issues
3. Check application logs for errors
4. Verify all environment variables are set correctly

---

🎉 **Congratulations!** Your AI image generation app now has a complete monetization system with subscriptions, credit purchases, and user management.