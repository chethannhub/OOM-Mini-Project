interface ParkingLot {
  id: number
  name: string
  address: string
  total_slots: number
  city: string
  available_slots: number
}

interface ParkingSlot {
  id: number
  lot_id: number
  slot_number: string
  slot_type: string
  status: 'available' | 'booked' | 'maintenance' | 'reserved'
  occupancy_status: 'empty' | 'occupied'
  sensor_id: string
  last_sensor_update: string
}

interface Booking {
  id: number
  user_id: number
  slot_id: number
  booking_reference: string
  start_time: string
  end_time: string | null
  booking_status: 'pending' | 'active' | 'completed' | 'cancelled'
  total_amount: number
  vehicle_number: string
}

// Simulated database storage
export const database = {
  parkingLots: [
    { id: 1, name: 'Downtown Plaza', address: '123 Main Street', total_slots: 120, city: 'New York', available_slots: 24 },
    { id: 2, name: 'Central Station', address: '456 Station Ave', total_slots: 200, city: 'New York', available_slots: 45 },
    { id: 3, name: 'Mall Parking', address: '789 Shopping Way', total_slots: 150, city: 'New York', available_slots: 12 },
    { id: 4, name: 'Business District', address: '321 Corporate Blvd', total_slots: 180, city: 'New York', available_slots: 67 }
  ] as ParkingLot[],

  slots: [] as ParkingSlot[],
  bookings: [] as Booking[],
  users: [] as any[],
  sensorLogs: [] as any[]
}

// Initialize slots for demo
export function initializeSlots() {
  const slots: ParkingSlot[] = []
  const sensorTypes = ['PIR', 'Ultrasonic', 'Camera', 'Magnetic']

  database.parkingLots.forEach(lot => {
    for (let i = 1; i <= lot.total_slots; i++) {
      const isOccupied = Math.random() < 0.65
      slots.push({
        id: slots.length + 1,
        lot_id: lot.id,
        slot_number: `${String.fromCharCode(64 + Math.ceil(i / 20))}-${String(i % 20 || 20).padStart(2, '0')}`,
        slot_type: i % 10 === 0 ? 'ev_charging' : i % 15 === 0 ? 'disabled' : 'standard',
        status: isOccupied ? 'booked' : 'available',
        occupancy_status: isOccupied ? 'occupied' : 'empty',
        sensor_id: `SENSOR-${lot.id}-${i}`,
        last_sensor_update: new Date().toISOString()
      })
    }
  })

  database.slots = slots
}

// Database query functions
export async function getParkingLots() {
  return database.parkingLots
}

export async function getParkingSlots(lotId?: number) {
  if (lotId) {
    return database.slots.filter(s => s.lot_id === lotId)
  }
  return database.slots
}

export async function getSlotsByStatus(status: string) {
  return database.slots.filter(s => s.status === status)
}

export async function updateSlotStatus(slotId: number, status: string) {
  const slot = database.slots.find(s => s.id === slotId)
  if (slot) {
    slot.status = status as any
    slot.occupancy_status = status === 'booked' ? 'occupied' : 'empty'
    slot.last_sensor_update = new Date().toISOString()
  }
  return slot
}

export async function createBooking(booking: Partial<Booking>) {
  const newBooking: Booking = {
    id: database.bookings.length + 1,
    user_id: booking.user_id!,
    slot_id: booking.slot_id!,
    booking_reference: `BK-${Date.now()}`,
    start_time: booking.start_time!,
    end_time: booking.end_time || null,
    booking_status: 'pending',
    total_amount: booking.total_amount || 0,
    vehicle_number: booking.vehicle_number!
  }
  database.bookings.push(newBooking)
  return newBooking
}

export async function getBookings(userId?: number) {
  if (userId) {
    return database.bookings.filter(b => b.user_id === userId)
  }
  return database.bookings
}

export async function logSensorData(sensorData: any) {
  database.sensorLogs.push({
    id: database.sensorLogs.length + 1,
    timestamp: new Date().toISOString(),
    ...sensorData
  })
}

export async function getAnalytics(lotId: number, date?: string) {
  const dateStr = date || new Date().toISOString().split('T')[0]
  const lotBookings = database.bookings.filter(b => b.lot_id === lotId)
  const totalRevenue = lotBookings.reduce((sum, b) => sum + b.total_amount, 0)

  return {
    lot_id: lotId,
    date: dateStr,
    total_bookings: lotBookings.length,
    total_revenue: totalRevenue,
    average_occupancy: ((database.slots.filter(s => s.lot_id === lotId && s.occupancy_status === 'occupied').length / database.slots.filter(s => s.lot_id === lotId).length) * 100).toFixed(2)
  }
}
