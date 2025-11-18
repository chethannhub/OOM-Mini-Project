"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function ParkingOverview() {
  const parkingLots = [
    {
      name: "Downtown Plaza",
      available: 24,
      total: 120,
      price: "$2.50/hr",
      distance: "0.5 km",
      status: "Available"
    },
    {
      name: "Central Station",
      available: 8,
      total: 200,
      price: "$1.50/hr",
      distance: "1.2 km",
      status: "Limited"
    },
    {
      name: "Mall Parking",
      available: 0,
      total: 150,
      price: "$3.00/hr",
      distance: "2.1 km",
      status: "Full"
    },
    {
      name: "Airport Complex",
      available: 156,
      total: 500,
      price: "$4.00/hr",
      distance: "8.5 km",
      status: "Available"
    }
  ]

  return (
    <section id="parking" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold">Real-Time Availability</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See available parking spots across all major locations in your city, updated every 30 seconds
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {parkingLots.map((lot, i) => {
            const availabilityPercent = (lot.available / lot.total) * 100
            const statusColor = availabilityPercent > 30 ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : 
                               availabilityPercent > 0 ? "bg-amber-500/10 text-amber-700 dark:text-amber-400" : 
                               "bg-red-500/10 text-red-700 dark:text-red-400"

            return (
              <Card key={i} className="overflow-hidden hover:shadow-lg transition-shadow animate-slide-up" style={{animationDelay: `${i * 100}ms`}}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{lot.name}</CardTitle>
                    <Badge className={statusColor}>{lot.status}</Badge>
                  </div>
                  <CardDescription>{lot.distance} away</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-foreground">{lot.available} Available</span>
                      <span className="text-sm text-muted-foreground">{lot.total} Total</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all"
                        style={{ width: `${availabilityPercent}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-border">
                    <span className="font-semibold text-primary">{lot.price}</span>
                    <button className="text-accent hover:underline text-sm font-medium">
                      Book Now →
                    </button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
