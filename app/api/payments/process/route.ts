import { NextRequest, NextResponse } from 'next/server'
import { database } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { booking_id, user_id, amount, payment_method } = body

    if (!booking_id || !user_id || !amount || !payment_method) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Simulate payment processing
    const isSuccessful = Math.random() > 0.05 // 95% success rate

    const payment = {
      id: database.bookings.length + 1000,
      booking_id,
      user_id,
      amount,
      currency: 'USD',
      payment_method,
      transaction_id: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: isSuccessful ? 'success' : 'failed',
      created_at: new Date().toISOString()
    }

    if (isSuccessful) {
      // Update booking payment status
      const booking = database.bookings.find(b => b.id === booking_id)
      if (booking) {
        booking.payment_status = 'paid'
      }
    }

    return NextResponse.json({
      success: isSuccessful,
      message: isSuccessful ? 'Payment processed successfully' : 'Payment failed',
      data: payment
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to process payment' },
      { status: 500 }
    )
  }
}
