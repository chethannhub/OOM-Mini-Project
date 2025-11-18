import { NextRequest, NextResponse } from 'next/server'
import { createPaymentMongo, getPaymentsMongo } from '@/lib/mongo'

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('user_id')
    const payments = await getPaymentsMongo(userId ? parseInt(userId) : undefined)

    return NextResponse.json({
      success: true,
      data: payments,
      count: payments.length
    })
  } catch (error) {
    console.error('[server] GET /api/payments error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch payments' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('[server] POST /api/payments body:', body)
    const { user_id, booking_id, amount, payment_method, status } = body

    if (!user_id || !booking_id || !amount) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const payment = await createPaymentMongo({
      user_id,
      booking_id,
      amount,
      payment_method: payment_method || 'card',
      status: status || 'pending'
    })
    console.log('[server] payment created:', payment)

    // Map _id to id for consistency
    const paymentWithId = {
      id: payment?._id?.toString(),
      ...payment
    }

    return NextResponse.json({
      success: true,
      message: 'Payment recorded successfully',
      data: paymentWithId
    })
  } catch (error) {
    console.error('[server] POST /api/payments error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create payment' },
      { status: 500 }
    )
  }
}
