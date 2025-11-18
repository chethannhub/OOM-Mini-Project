import { getBookingsMongo } from '@/lib/mongo'

export default async function BookingPage({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const bookingId = id
    if (!bookingId) {
      return (
        <div className="p-6">
          <h2 className="text-xl font-semibold">Invalid Booking ID</h2>
          <p className="mt-2 text-sm">No booking ID provided.</p>
        </div>
      )
    }

    const bookings = await getBookingsMongo()
    const booking = bookings.find(b => b._id?.toString() === bookingId)

    if (!booking) {
      return (
        <div className="p-6">
          <h2 className="text-xl font-semibold">Booking not found</h2>
          <p className="mt-2 text-sm">We couldn't find a booking with ID {bookingId}.</p>
        </div>
      )
    }

    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold">Booking Confirmed</h2>
        <div className="mt-4 space-y-2">
          <div><strong>Booking ID:</strong> {booking._id?.toString()}</div>
          <div><strong>User ID:</strong> {booking.user_id}</div>
          <div><strong>Slot ID:</strong> {booking.slot_id}</div>
          <div><strong>Start Time:</strong> {booking.start_time}</div>
          <div><strong>Vehicle Number:</strong> {booking.vehicle_number}</div>
          <div><strong>Total Amount:</strong> ₹{booking.total_amount}</div>
          <div><strong>Created At:</strong> {booking.created_at?.toString()}</div>
        </div>
      </div>
    )
  } catch (error) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold">Error</h2>
        <p className="mt-2 text-sm">Failed to load booking details.</p>
      </div>
    )
  }
}
