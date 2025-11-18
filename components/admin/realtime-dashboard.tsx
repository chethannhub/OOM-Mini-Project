"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { AlertCircle, TrendingUp } from 'lucide-react'

export default function RealtimeDashboard() {
  const [occupancyData, setOccupancyData] = useState<any[]>([])
  const [currentStats, setCurrentStats] = useState<any>(null)
  const [alerts, setAlerts] = useState<any[]>([])

  useEffect(() => {
    const fetchOccupancy = async () => {
      try {
        // Fetch from all lots
        for (let lotId = 1; lotId <= 4; lotId++) {
          const response = await fetch(`/api/realtime/parking-occupancy?lot_id=${lotId}`)
          const data = await response.json()

          setCurrentStats(prev => ({
            ...prev,
            [`lot_${lotId}`]: data.data
          }))

          // Add to chart data
          setOccupancyData(prev => [
            ...prev,
            {
              time: new Date().toLocaleTimeString(),
              lot: lotId,
              available: data.data.available_slots,
              occupied: data.data.occupied_slots
            }
          ])
        }
      } catch (error) {
        console.error('Failed to fetch occupancy:', error)
      }
    }

    fetchOccupancy()

    // Refresh every 30 seconds
    const interval = setInterval(fetchOccupancy, 30000)
    return () => clearInterval(interval)
  }, [])

  // Generate alerts based on occupancy
  useEffect(() => {
    if (!currentStats) return

    const newAlerts: any[] = []

    Object.entries(currentStats).forEach(([lot, stats]: [string, any]) => {
      const occupancyRate = parseFloat(stats.occupancy_rate)

      if (occupancyRate > 85) {
        newAlerts.push({
          id: lot,
          level: 'critical',
          message: `${lot}: Critical occupancy (${occupancyRate}%) - Consider closing to new bookings`
        })
      } else if (occupancyRate > 70) {
        newAlerts.push({
          id: lot,
          level: 'warning',
          message: `${lot}: High occupancy (${occupancyRate}%) - Monitor closely`
        })
      }
    })

    setAlerts(newAlerts)
  }, [currentStats])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {currentStats && Object.entries(currentStats).map(([lot, stats]: [string, any]) => (
          <Card key={lot}>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-2 capitalize">{lot.replace('_', ' ')}</p>
              <p className="text-3xl font-bold text-primary mb-1">{stats.available_slots}</p>
              <p className="text-xs text-muted-foreground">Available of {stats.total_slots}</p>
              <div className="mt-3 w-full bg-muted rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
                  style={{ width: `${parseFloat(stats.occupancy_rate)}%` }}
                ></div>
              </div>
              <p className="text-xs mt-2 text-muted-foreground">{stats.occupancy_rate}% occupied</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Occupancy Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Live Occupancy Trend
          </CardTitle>
          <CardDescription>Real-time availability updates</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={occupancyData.slice(-50)}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="time" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px'
                }}
              />
              <Line type="monotone" dataKey="available" stroke="var(--color-accent)" name="Available" />
              <Line type="monotone" dataKey="occupied" stroke="var(--color-primary)" name="Occupied" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <Card className="border-amber-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <AlertCircle className="w-5 h-5" />
              Active Alerts ({alerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map(alert => (
              <Alert key={alert.id} className={alert.level === 'critical' ? 'border-red-500/30 bg-red-500/5' : 'border-amber-500/30 bg-amber-500/5'}>
                <AlertCircle className={`w-4 h-4 ${alert.level === 'critical' ? 'text-red-600' : 'text-amber-600'}`} />
                <AlertDescription className={alert.level === 'critical' ? 'text-red-700 dark:text-red-400' : 'text-amber-700 dark:text-amber-400'}>
                  {alert.message}
                </AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
