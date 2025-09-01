import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createPortalSession } from '@/lib/stripe';
import { getCurrentUserFromDB } from '@/lib/user-service';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await getCurrentUserFromDB();
    if (!user || !user.customerId) {
      return NextResponse.json(
        { error: 'No customer found' },
        { status: 404 }
      );
    }

    const session = await createPortalSession(
      user.customerId,
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
    );

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Portal session error:', error);
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    );
  }
}