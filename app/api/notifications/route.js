// /api/notifications/route.js

import { connectToDB } from '@/lib/db';
import Notification from '@/models/Notification';
import { NextResponse } from 'next/server';

export async function GET() {
  await connectToDB();

  const notifications = await Notification
    .find({ read: false })
    .sort({ createdAt: -1 })
    .limit(10);

  return NextResponse.json(notifications);
}