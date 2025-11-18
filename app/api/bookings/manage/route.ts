import { NextRequest, NextResponse } from 'next/server'
import { database, updateSlotStatus } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, booking_id, user_id, slot_id, lot_id, duration_hours, vehicle_number, payment_method } = body

    if (action === 'create') {
      // Create new booking
      if (!user_id || !slot_id || !lot_id || !duration_hours) {
        return NextResponse.json(
          { success: false, error: 'Missing required fields' },
          { status: 400 }
        )
      }

      const bookingRef = `BK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const pricePerHour = 2.5
      const totalAmount = duration_hours * pricePerHour

      const booking = {
        id: database.bookings.length + 1,
        user_id,
        slot_id,
        lot_id,
        booking_reference: bookingRef,
        start_time: new Date().toISOString(),
        end_time: new Date(Date.now() + duration_hours * 3600000).toISOString(),
        expected_duration_minutes: duration_hours * 60,
        booking_status: 'active',
        payment_status: 'paid',
        total_amount: totalAmount,
        vehicle_number,
        payment_method
      }

      // Update slot status to booked
      await updateSlotStatus(slot_id, 'booked')

      database.bookings.push(booking)

      return NextResponse.json({
        success: true,
        message: 'Booking created successfully',
        data: booking
      })
    }

    if (action === 'extend') {
      // Extend existing booking
      const booking = database.bookings.find(b => b.id === booking_id)
      if (!booking) {
        return NextResponse.json(
          { success: false, error: 'Booking not found' },
          { status: 404 }
        )
      }

      const extensionHours = body.extension_hours || 1
      const pricePerHour = 2.5
      const extensionCost = extensionHours * pricePerHour
      booking.total_amount += extensionCost
      booking.end_time = new Date(new Date(booking.end_time).getTime() + extensionHours * 3600000).toISOString()

      return NextResponse.json({
        success: true,
        message: 'Booking extended successfully',
        data: { booking, extension_cost: extensionCost }
      })
    }

    if (action === 'cancel') {
      // Cancel booking
      const booking = database.bookings.find(b => b.id === booking_id)
      if (!booking) {
        return NextResponse.json(
          { success: false, error: 'Booking not found' },
          { status: 404 }
        )
      }

      booking.booking_status = 'cancelled'
      await updateSlotStatus(booking.slot_id, 'available')

      // Calculate refund
      const now = new Date()
      const bookingStart = new Date(booking.start_time)
      const minutesUsed = (now.getTime() - bookingStart.getTime()) / 60000
      const pricePerHour = 2.5
      const costIncurred = (minutesUsed / 60) * pricePerHour
      const refundAmount = Math.max(0, booking.total_amount - costIncurred)

      return NextResponse.json({
        success: true,
        message: 'Booking cancelled successfully',
        data: {
          booking,
          cost_incurred: costIncurred.toFixed(2),
          refund_amount: refundAmount.toFixed(2)
        }
      })
    }

    if (action === 'complete') {
      // Complete booking
      const booking = database.bookings.find(b => b.id === booking_id)
      if (!booking) {
        return NextResponse.json(
          { success: false, error: 'Booking not found' },
          { status: 404 }
        )
      }

      booking.booking_status = 'completed'
      await updateSlotStatus(booking.slot_id, 'available')

      return NextResponse.json({
        success: true,
        message: 'Booking completed successfully',
        data: booking
      })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to manage booking' },
      { status: 500 }
    )
  }
}
