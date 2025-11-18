"use client"

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Navigation, Filter } from 'lucide-react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'

// react-leaflet components have complex typings in some Next.js setups; cast to any for JSX usage here
const RMapContainer: any = MapContainer
const RTileLayer: any = TileLayer
const RCircleMarker: any = CircleMarker
const RPopup: any = Popup

export default function ParkingMap() {
  const [selectedLot, setSelectedLot] = useState<any | null>(null)
  const [selectedDuration, setSelectedDuration] = useState<number>(2)
  const [filterOpen, setFilterOpen] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState({ type: 'all', price: 'all' })

  const parkingLots = [
    {
      id: 1,
      name: "Downtown Plaza",
      address: "123 Main Street",
      available: 24,
      total: 120,
      price: 2.50,
      type: "outdoor",
      distance: 0.5,
      rating: 4.8,
      amenities: ["24/7", "CCTV", "EV Charging"],
      mapPosition: { x: 45, y: 35 }
    },
    {
      id: 2,
      name: "Central Station",
      address: "456 Station Ave",
      available: 8,
      total: 200,
      price: 1.50,
      type: "indoor",
      distance: 1.2,
      rating: 4.6,
      amenities: ["Covered", "CCTV"],
      mapPosition: { x: 65, y: 50 }
    },
    {
      id: 3,
      name: "Mall Parking",
      address: "789 Shopping Way",
      available: 12,
      total: 150,
      price: 3.00,
      type: "outdoor",
      distance: 2.1,
      rating: 4.7,
      amenities: ["Free WiFi", "CCTV"],
      mapPosition: { x: 30, y: 65 }
    },
    {
      id: 4,
      name: "Business District",
      address: "321 Corporate Blvd",
      available: 45,
      total: 180,
      price: 2.00,
      type: "indoor",
      distance: 0.8,
      rating: 4.9,
      amenities: ["EV Charging", "Security", "CCTV"],
      mapPosition: { x: 70, y: 40 }
    },
    {
      id: 5,
      name: "Indiranagar Metro",
      address: "456 Indiranagar Main Road",
      available: 35,
      total: 160,
      price: 1.75,
      type: "outdoor",
      distance: 1.5,
      rating: 4.5,
      amenities: ["CCTV", "24/7 Guard"],
      mapPosition: { x: 65, y: 30 }
    },
    {
      id: 6,
      name: "Whitefield Tech Park",
      address: "789 Whitefield Avenue",
      available: 80,
      total: 250,
      price: 2.25,
      type: "outdoor",
      distance: 3.2,
      rating: 4.7,
      amenities: ["EV Charging", "Free WiFi", "CCTV"],
      mapPosition: { x: 75, y: 25 }
    },
    {
      id: 7,
      name: "Koramangala Corner",
      address: "100 Koramangala 5th Block",
      available: 18,
      total: 80,
      price: 3.50,
      type: "indoor",
      distance: 1.8,
      rating: 4.6,
      amenities: ["Covered", "CCTV", "Security"],
      mapPosition: { x: 35, y: 50 }
    },
    {
      id: 8,
      name: "JP Nagar Station Area",
      address: "234 JP Nagar Main Street",
      available: 5,
      total: 120,
      price: 1.50,
      type: "outdoor",
      distance: 2.5,
      rating: 4.4,
      amenities: ["24/7", "CCTV"],
      mapPosition: { x: 25, y: 70 }
    },
    {
      id: 9,
      name: "Marathahalli Tech Hub",
      address: "567 Marathahalli Expressway",
      available: 62,
      total: 200,
      price: 2.10,
      type: "indoor",
      distance: 3.8,
      rating: 4.8,
      amenities: ["EV Charging", "Security", "CCTV"],
      mapPosition: { x: 80, y: 55 }
    },
    {
      id: 10,
      name: "Vidhana Soudha Lot",
      address: "321 Vidhana Soudha Road",
      available: 28,
      total: 140,
      price: 2.75,
      type: "outdoor",
      distance: 0.9,
      rating: 4.5,
      amenities: ["CCTV", "Security Guard"],
      mapPosition: { x: 45, y: 55 }
    }
  ]

  const filteredLots = useMemo(() => {
    return parkingLots.filter(lot => {
      if (selectedFilters.type !== 'all' && lot.type !== selectedFilters.type) return false
      if (selectedFilters.price === 'budget' && lot.price > 2) return false
      if (selectedFilters.price === 'standard' && (lot.price < 1.5 || lot.price > 3)) return false
      if (selectedFilters.price === 'premium' && lot.price < 2.5) return false
      return true
    })
  }, [selectedFilters])

  return (
    <div className="h-full flex flex-col gap-4 p-4 sm:p-6">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 bg-card border border-border rounded-lg px-4 py-2 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search parking locations..."
            className="flex-1 bg-transparent outline-none text-sm"
          />
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setFilterOpen(!filterOpen)}
          className="sm:w-auto"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Filter Panel */}
      {filterOpen && (
        <Card className="animate-slide-up">
          <CardContent className="pt-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Type</label>
                <select
                  value={selectedFilters.type}
                  onChange={(e) => setSelectedFilters({...selectedFilters, type: e.target.value})}
                  className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm"
                >
                  <option value="all">All Types</option>
                  <option value="indoor">Indoor</option>
                  <option value="outdoor">Outdoor</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Price Range</label>
                <select
                  value={selectedFilters.price}
                  onChange={(e) => setSelectedFilters({...selectedFilters, price: e.target.value})}
                  className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm"
                >
                  <option value="all">All Prices</option>
                  <option value="budget">Budget (&lt;$2/hr)</option>
                  <option value="standard">Standard ($1.5-$3)</option>
                  <option value="premium">Premium (&gt;$2.5)</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Map and List Container */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
        {/* Map Visualization - replace SVG with interactive Leaflet map centered on Bangalore */}
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-6 relative overflow-hidden">
          <div className="h-96 lg:h-full rounded-lg overflow-hidden">
            {/* Leaflet map */}
            <RMapContainer center={[12.9716, 77.5946]} zoom={13} className="w-full h-full">
              <RTileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {filteredLots.map((lot) => {
                // convert demo lots to lat/lng by scattering around Bangalore center
                const lat = 12.9716 + (lot.mapPosition.y - 50) * 0.002
                const lng = 77.5946 + (lot.mapPosition.x - 50) * 0.002
                const isStation = /station/i.test(lot.name)
                return (
                  <RCircleMarker
                    key={lot.id}
                    center={[lat, lng]}
                    radius={12}
                    pathOptions={{
                      color: isStation ? '#e11d48' : lot.available > 0 ? '#16a34a' : '#dc2626',
                      fillColor: isStation ? '#fecaca' : lot.available > 0 ? '#16a34a' : '#dc2626',
                      fillOpacity: 1,
                      weight: isStation ? 3 : 1,
                    }}
                    eventHandlers={{ click: () => setSelectedLot(lot) }}
                  >
                    <RPopup>
                      <div className="font-semibold">{lot.name}</div>
                      <div className="text-sm text-muted-foreground">{lot.address}</div>
                      <div className="mt-1">Available: {lot.available}</div>
                    </RPopup>
                  </RCircleMarker>
                )
              })}
            </RMapContainer>
          </div>

          {/* Map Legend */}
          <div className="absolute bottom-4 left-4 bg-background/95 backdrop-blur border border-border rounded-lg p-3 text-xs space-y-2">
            <div className="font-semibold">Availability</div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-emerald-500"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-red-500"></div>
              <span>Full</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-red-200 ring-4 ring-red-400/40 ring-offset-2 ring-offset-background"></div>
              <span>Station</span>
            </div>
          </div>
        </div>

        {/* Details Panel */}
        {selectedLot && (
          <div className="bg-card border border-border rounded-lg p-4 overflow-y-auto animate-slide-up">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{selectedLot.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedLot.address}</p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-primary">${selectedLot.price.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">per hour</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-accent">{selectedLot.available}</div>
                  <p className="text-xs text-muted-foreground">available</p>
                </div>
              </div>

              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Distance</span>
                  <span className="font-medium">{selectedLot.distance} km</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Rating</span>
                  <span className="font-medium">⭐ {selectedLot.rating}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Type</span>
                  <Badge variant={selectedLot.type === 'indoor' ? 'default' : 'secondary'}>
                    {selectedLot.type}
                  </Badge>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-xs font-semibold mb-2">Amenities</p>
                <div className="flex flex-wrap gap-2">
                  {selectedLot.amenities.map((amenity: string, i: number) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Duration Selection */}
              <div className="border-t border-border pt-4">
                <p className="text-sm font-semibold mb-3">How long do you need parking?</p>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3, 4, 6, 12].map((hours) => (
                    <button
                      key={hours}
                      onClick={() => setSelectedDuration(hours)}
                      className={`py-2 px-2 rounded-lg text-sm font-medium transition-all border ${
                        selectedDuration === hours
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background border-border hover:border-primary'
                      }`}
                    >
                      {hours}h
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Calculation */}
              <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg p-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium">{selectedDuration} hours</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Price per hour</span>
                  <span className="font-medium">${selectedLot.price.toFixed(2)}</span>
                </div>
                <div className="border-t border-emerald-200 dark:border-emerald-800 pt-2 flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-lg text-emerald-600 dark:text-emerald-400">
                    ${(selectedLot.price * selectedDuration).toFixed(2)}
                  </span>
                </div>
              </div>

              <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 h-11">
                <Navigation className="w-4 h-4 mr-2" />
                Continue to Payment
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
