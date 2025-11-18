import { NextRequest, NextResponse } from 'next/server'
import { database } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('user_id')
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '20')
    const offset = parseInt(request.nextUrl.searchParams.get('offset') || '0')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'user_id is required' },
        { status: 400 }
      )
    }

    const userBookings = database.bookings.filter(b => b.user_id === parseInt(userId))
    const paginatedBookings = userBookings
      .sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime())
      .slice(offset, offset + limit)

    return NextResponse.json({
      success: true,
      data: paginatedBookings,
      pagination: {
        total: userBookings.length,
        limit,
        offset,
        hasMore: offset + limit < userBookings.length
      }
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch booking history' },
      { status: 500 }
    )
  }
}
