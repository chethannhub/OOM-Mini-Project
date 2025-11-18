import { NextRequest, NextResponse } from 'next/server'
import { createBookingMongo, getBookingsMongo } from '@/lib/mongo'

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('user_id')
    const bookings = await getBookingsMongo(userId ? parseInt(userId) : undefined)

    return NextResponse.json({
      success: true,
      data: bookings,
      count: bookings.length
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('[server] POST /api/bookings body:', body)
    const { user_id, slot_id, lot_id, start_time, expected_duration_minutes, vehicle_number, total_amount } = body

    if (!user_id || !slot_id || !lot_id || !start_time) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const booking = await createBookingMongo({
      user_id,
      slot_id,
      start_time,
      total_amount,
      vehicle_number
    })
    console.log('[server] booking created:', booking)

    // Map _id to id for consistency
    const bookingWithId = {
      id: booking?._id?.toString(),
      ...booking
    }

    return NextResponse.json({
      success: true,
      message: 'Booking created successfully',
      data: bookingWithId
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}
