import { NextRequest, NextResponse } from 'next/server'

const notificationStore: Map<number, any[]> = new Map()

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('user_id')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'user_id is required' },
        { status: 400 }
      )
    }

    const userNotifications = notificationStore.get(parseInt(userId)) || []

    return NextResponse.json({
      success: true,
      data: userNotifications,
      count: userNotifications.length
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, notification_type, title, message, data } = body

    if (!user_id || !notification_type) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const notification = {
      id: Math.random(),
      user_id,
      notification_type,
      title,
      message,
      data,
      read: false,
      created_at: new Date().toISOString()
    }

    if (!notificationStore.has(user_id)) {
      notificationStore.set(user_id, [])
    }

    notificationStore.get(user_id)!.push(notification)

    return NextResponse.json({
      success: true,
      message: 'Notification sent',
      data: notification
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to send notification' },
      { status: 500 }
    )
  }
}
