import { NextRequest, NextResponse } from 'next/server'
import { database } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('user_id')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'user_id is required' },
        { status: 400 }
      )
    }

    const activeBookings = database.bookings.filter(
      b => b.user_id === parseInt(userId) && 
           (b.booking_status === 'active' || b.booking_status === 'pending')
    )

    return NextResponse.json({
      success: true,
      data: activeBookings,
      count: activeBookings.length
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch active bookings' },
      { status: 500 }
    )
  }
}
