import { NextRequest, NextResponse } from 'next/server'
import { getParkingSlots, updateSlotStatus } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const lotId = request.nextUrl.searchParams.get('lot_id')
    const status = request.nextUrl.searchParams.get('status')

    let slots

    if (lotId) {
      slots = await getParkingSlots(parseInt(lotId))
    } else {
      slots = await getParkingSlots()
    }

    if (status) {
      slots = slots.filter(s => s.status === status)
    }

    return NextResponse.json({
      success: true,
      data: slots,
      count: slots.length
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch slots' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { slot_id, status } = body

    if (!slot_id || !status) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const updatedSlot = await updateSlotStatus(slot_id, status)

    return NextResponse.json({
      success: true,
      message: 'Slot status updated',
      data: updatedSlot
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update slot' },
      { status: 500 }
    )
  }
}
