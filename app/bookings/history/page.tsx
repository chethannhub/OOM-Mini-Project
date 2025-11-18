'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function BookingHistoryPage() {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await fetch('/api/bookings')
        const data = await res.json()
        setBookings(data?.data || [])
      } catch (err) {
        console.error('Failed to fetch bookings:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchBookings()
    // Auto-refresh every 3 seconds
    const interval = setInterval(fetchBookings, 3000)
    return () => clearInterval(interval)
  }, [])

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Booking History</h1>
      {bookings.length === 0 ? (
        <div>
          <p className="text-muted-foreground">No bookings found.</p>
          <Link href="/driver"><Button className="mt-4">Book Now</Button></Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking: any) => (
            <div key={booking._id?.toString() || booking.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold">Booking ID: {booking.id || booking._id?.toString()}</div>
                  <div className="text-sm text-muted-foreground">Reference: {booking.booking_reference}</div>
                  <div className="text-sm mt-1">Vehicle: {booking.vehicle_number}</div>
                  <div className="text-sm">Start: {new Date(booking.start_time).toLocaleString()}</div>
                  <div className="text-sm">Status: <span className={`font-medium ${booking.booking_status === 'completed' ? 'text-green-600' : 'text-blue-600'}`}>{booking.booking_status}</span></div>
                  <div className="text-sm font-semibold mt-1">Total: ₹{booking.total_amount}</div>
                </div>
                <Link href={`/bookings/${booking.id || booking._id?.toString()}`}>
                  <Button size="sm">View</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
