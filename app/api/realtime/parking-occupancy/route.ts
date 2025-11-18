import { NextRequest, NextResponse } from 'next/server'
import { getSensorSimulator } from '@/lib/sensor-service'
import { getParkingSlots } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const lotId = request.nextUrl.searchParams.get('lot_id')
    
    if (!lotId) {
      return NextResponse.json(
        { success: false, error: 'lot_id is required' },
        { status: 400 }
      )
    }

    const slots = await getParkingSlots(parseInt(lotId))
    const occupiedSlots = slots.filter(s => s.occupancy_status === 'occupied').length
    const availableSlots = slots.filter(s => s.occupancy_status === 'empty').length
    const totalSlots = slots.length

    return NextResponse.json({
      success: true,
      data: {
        lot_id: parseInt(lotId),
        total_slots: totalSlots,
        occupied_slots: occupiedSlots,
        available_slots: availableSlots,
        occupancy_rate: ((occupiedSlots / totalSlots) * 100).toFixed(2),
        timestamp: new Date().toISOString(),
        slots: slots
      }
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch occupancy data' },
      { status: 500 }
    )
  }
}
