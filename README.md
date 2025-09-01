# ImagineX - AI-Powered Image Generator

A modern, full-featured AI image generation platform built with Next.js, featuring user authentication, credit management, and multiple AI models.

## Features

- 🎨 **AI Image Generation** - Generate stunning images using multiple AI models (FLUX, Stable Diffusion)
- � **Uuser Authentication** - Secure authentication with Clerk
- 💳 **Credit System** - Track usage with a flexible credit system
- 📊 **User Dashboard** - Manage generations, view stats, and account settings
- 🎯 **Template Gallery** - Pre-built templates for different use cases
- 📱 **Responsive Design** - Works perfectly on all devices
- � ️ **Database Integration** - PostgreSQL with Prisma ORM
- 🔄 **Real-time Updates** - Live generation status and progress

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Authentication**: Clerk
- **Database**: PostgreSQL with Prisma
- **AI Integration**: Fal.ai
- **Styling**: Tailwind CSS + shadcn/ui
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Fal.ai API key
- Clerk account

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd imaginex
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Fill in your environment variables:

   ```env
   # Fal.ai API Configuration
   NEXT_PUBLIC_FAL_KEY=your_fal_api_key_here
   FAL_KEY=your_fal_api_key_here

   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/imaginex?schema=public"

   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
   CLERK_SECRET_KEY=your_clerk_secret_key_here
   CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret_here
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
   ```

4. **Set up the database**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**

   ```bash
   npm run dev
   # or
   bun dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Configuration

### Fal.ai Setup

1. Sign up at [fal.ai](https://fal.ai)
2. Get your API key from the dashboard
3. Add it to your environment variables

### Clerk Setup

1. Create a Clerk application at [clerk.com](https://clerk.com)
2. Configure your authentication settings
3. Set up webhooks for user sync:
   - Webhook URL: `https://yourdomain.com/api/webhooks/clerk`
   - Events: `user.created`, `user.updated`, `user.deleted`

### Database Setup

1. Create a PostgreSQL database
2. Update the `DATABASE_URL` in your `.env.local`
3. Run Prisma migrations

## Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard page
│   ├── sign-in/          # Authentication pages
│   └── sign-up/
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Custom components
├── lib/                  # Utility functions
│   ├── prisma.ts         # Database client
│   ├── fal-client.ts     # AI service
│   └── user-service.ts   # User management
└── types/                # TypeScript types
```

## API Endpoints

- `POST /api/generate` - Generate images
- `GET /api/user` - Get user stats
- `GET /api/user/generations` - Get user generations
- `DELETE /api/user/generations` - Delete generation
- `POST /api/webhooks/clerk` - Clerk webhook handler

## Features in Detail

### AI Models

- **FLUX Schnell**: Fast, high-quality generation (1 credit)
- **FLUX Dev**: Higher quality, slower generation (2 credits)
- **Stable Diffusion v3**: Versatile image generation (1 credit)

### Credit System

- Free tier: 10 credits/month
- Pro tier: 500 credits/month
- Enterprise tier: 2000 credits/month

### Image Generation Options

- Multiple aspect ratios (square, portrait, landscape)
- Style presets (photorealistic, digital art, minimalist, etc.)
- Negative prompts for better control
- Seed control for reproducible results
- Batch generation (up to 4 images)

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The app can be deployed on any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email <support@imaginex.com> or join our Discord community.
