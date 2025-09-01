import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  try {
    if (!webhookSecret) {
      throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
    }

    // Get the headers
    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response('Error occurred -- no svix headers', {
        status: 400
      });
    }

    // Get the body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    // Create a new Svix instance with your secret.
    const wh = new Webhook(webhookSecret);

    let evt: WebhookEvent;

    // Verify the payload with the headers
    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
    } catch (err) {
      console.error('Error verifying webhook:', err);
      return new Response('Error occurred', {
        status: 400
      });
    }

    // Handle the webhook
    const eventType = evt.type;

    if (eventType === 'user.created' || eventType === 'user.updated') {
      const { id, email_addresses, first_name, last_name, image_url } = evt.data;
      const email = email_addresses?.[0]?.email_address;
      const name = first_name && last_name ? `${first_name} ${last_name}` : first_name || 'New User';

      // Upsert the user in the database
      await prisma.user.upsert({
        where: { clerkId: id },
        update: {
          email: email || undefined,
          name: name,
          imageUrl: image_url,
        },
        create: {
          clerkId: id,
          email: email || '',
          name: name,
          imageUrl: image_url,
          subscription: 'FREE',
          creditsUsed: 0,
          creditsLimit: 10, // Default free tier credits
        },
      });

      console.log(`User ${id} was ${eventType.split('.')[1]}`);
    }

    return new Response('', { status: 200 });
  } catch (error) {
    console.error('Error in webhook handler:', error);
    return new Response('Error processing webhook', { status: 500 });
  }
}

export async function GET() {
  return new Response('Hello, World!', { status: 200 });
}