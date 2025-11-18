import { NextRequest, NextResponse } from 'next/server'
import { logSensorData, getParkingSlots, updateSlotStatus } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const lotId = request.nextUrl.searchParams.get('lot_id')
    const slots = await getParkingSlots(lotId ? parseInt(lotId) : undefined)

    const occupancyStats = {
      total_slots: slots.length,
      occupied: slots.filter(s => s.occupancy_status === 'occupied').length,
      available: slots.filter(s => s.occupancy_status === 'empty').length,
      occupancy_rate: ((slots.filter(s => s.occupancy_status === 'occupied').length / slots.length) * 100).toFixed(2)
    }

    return NextResponse.json({
      success: true,
      data: occupancyStats
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sensor data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sensor_id, slot_id, lot_id, occupancy_status, battery_level, signal_strength } = body

    // Log sensor data
    await logSensorData({
      sensor_id,
      slot_id,
      lot_id,
      occupancy_status,
      battery_level,
      signal_strength,
      timestamp: new Date()
    })

    // Update slot occupancy based on sensor
    if (slot_id && occupancy_status) {
      const newStatus = occupancy_status === 'occupied' ? 'booked' : 'available'
      await updateSlotStatus(slot_id, newStatus)
    }

    return NextResponse.json({
      success: true,
      message: 'Sensor data logged and slot updated'
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to process sensor data' },
      { status: 500 }
    )
  }
}
