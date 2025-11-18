"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, AlertCircle, CheckCircle, X } from 'lucide-react'

export default function RealtimeBookingStatus({ userId }: { userId: number }) {
  const [activeBooking, setActiveBooking] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [timeRemaining, setTimeRemaining] = useState<string>('')

  useEffect(() => {
    // Fetch active booking
    const fetchActiveBooking = async () => {
      try {
        const response = await fetch(`/api/bookings/active?user_id=${userId}`)
        const data = await response.json()
        if (data.data.length > 0) {
          setActiveBooking(data.data[0])
        }
        setLoading(false)
      } catch (error) {
        console.error('Failed to fetch active booking:', error)
        setLoading(false)
      }
    }

    fetchActiveBooking()

    // Refresh every 10 seconds
    const interval = setInterval(fetchActiveBooking, 10000)
    return () => clearInterval(interval)
  }, [userId])

  useEffect(() => {
    if (!activeBooking) return

    const updateTimeRemaining = () => {
      const endTime = new Date(activeBooking.end_time).getTime()
      const now = new Date().getTime()
      const diff = endTime - now

      if (diff <= 0) {
        setTimeRemaining('Expired')
        return
      }

      const hours = Math.floor(diff / 3600000)
      const minutes = Math.floor((diff % 3600000) / 60000)
      const seconds = Math.floor((diff % 60000) / 1000)

      setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`)
    }

    updateTimeRemaining()
    const interval = setInterval(updateTimeRemaining, 1000)
    return () => clearInterval(interval)
  }, [activeBooking])

  if (loading) {
    return <div className="text-center py-8">Loading booking status...</div>
  }

  if (!activeBooking) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">No active bookings</p>
        </CardContent>
      </Card>
    )
  }

  const isExpiringSoon = new Date(activeBooking.end_time).getTime() - Date.now() < 600000 // 10 minutes

  return (
    <Card className={`border-2 ${isExpiringSoon ? 'border-amber-500/50' : 'border-emerald-500/50'}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-500" />
          Active Booking
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Reference</p>
          <p className="font-mono font-bold">{activeBooking.booking_reference}</p>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Time Remaining</p>
          <div className="flex items-center gap-2">
            <Clock className={`w-5 h-5 ${isExpiringSoon ? 'text-amber-500' : 'text-emerald-500'}`} />
            <p className={`text-2xl font-bold ${isExpiringSoon ? 'text-amber-600' : 'text-emerald-600'}`}>
              {timeRemaining}
            </p>
          </div>
        </div>

        {isExpiringSoon && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 flex items-gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">Expiring Soon</p>
              <p className="text-xs text-amber-600 dark:text-amber-300">Consider extending your booking</p>
            </div>
          </div>
        )}

        <div className="pt-4 space-y-2">
          <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90">
            Extend Booking
          </Button>
          <Button variant="outline" className="w-full">
            End Parking Session
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
