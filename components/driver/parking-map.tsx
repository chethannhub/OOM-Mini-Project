"use client"

import { useState, useMemo, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Navigation } from 'lucide-react'

// Dynamically import MapContainer to avoid server-side rendering
const MapContainer = dynamic(
  () => import('react-leaflet').then(mod => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import('react-leaflet').then(mod => mod.TileLayer),
  { ssr: false }
)
const CircleMarker = dynamic(
  () => import('react-leaflet').then(mod => mod.CircleMarker),
  { ssr: false }
)
const Popup = dynamic(
  () => import('react-leaflet').then(mod => mod.Popup),
  { ssr: false }
)

const RMapContainer: any = MapContainer
const RTileLayer: any = TileLayer
const RCircleMarker: any = CircleMarker
const RPopup: any = Popup

export default function ParkingMap() {
  const [selectedLot, setSelectedLot] = useState<any | null>(null)
  const [selectedDuration, setSelectedDuration] = useState<number>(2)
  const [selectedArea, setSelectedArea] = useState<string | null>(null)
  const [customCenter, setCustomCenter] = useState<[number, number] | null>(null)
  const [geoLoading, setGeoLoading] = useState(false)
  const router = useRouter()

  const parkingAreas: Record<string, { center: [number, number] }> = {
    Downtown: { center: [12.9716, 77.5946] },
    Indiranagar: { center: [12.9719, 77.6412] },
    Whitefield: { center: [12.9698, 77.7499] },
    Koramangala: { center: [12.9352, 77.6245] },
    'JP Nagar': { center: [12.9279, 77.5836] },
    Marathahalli: { center: [12.9713, 77.6945] },
  }

  const parkingLots = [
    { id: 1, name: 'Downtown Plaza', address: '123 Main Street', available: 24, price: 2.5, type: 'outdoor', rating: 4.8, amenities: ['24/7', 'CCTV'], lat: 12.9716, lng: 77.5946 },
    { id: 2, name: 'Central Station', address: '456 Station Ave', available: 8, price: 1.5, type: 'indoor', rating: 4.6, amenities: ['Covered'], lat: 12.9750, lng: 77.5950 },
    { id: 3, name: 'Mall Parking', address: '789 Shopping Way', available: 0, price: 3.0, type: 'outdoor', rating: 4.7, amenities: ['Free WiFi'], lat: 12.9660, lng: 77.5920 },
    { id: 4, name: 'Indiranagar Metro', address: '456 Indiranagar Main Road', available: 35, price: 1.75, type: 'outdoor', rating: 4.5, amenities: ['CCTV'], lat: 12.9719, lng: 77.6412 },
    { id: 5, name: 'Whitefield Tech Park', address: '789 Whitefield Avenue', available: 80, price: 2.25, type: 'outdoor', rating: 4.7, amenities: ['EV Charging'], lat: 12.9698, lng: 77.7499 },
    { id: 6, name: 'Koramangala Mall', address: 'Koramangala Main', available: 6, price: 2.0, type: 'indoor', rating: 4.4, amenities: ['CCTV'], lat: 12.9352, lng: 77.6245 },
    { id: 7, name: 'JP Nagar Station Area', address: '234 JP Nagar Main Street', available: 0, price: 1.5, type: 'outdoor', rating: 4.4, amenities: ['24/7', 'CCTV'], lat: 12.9279, lng: 77.5836 },
    { id: 8, name: 'Marathahalli Parking', address: 'Marathahalli Main', available: 12, price: 1.8, type: 'outdoor', rating: 4.3, amenities: ['EV Charging'], lat: 12.9713, lng: 77.6945 },
    { id: 9, name: 'Ulsoor Lake Lot', address: 'Ulsoor', available: 4, price: 2.2, type: 'outdoor', rating: 4.1, amenities: [], lat: 12.9738, lng: 77.6201 },
    { id: 10, name: 'Baiyappanahalli Station', address: 'Baiyappanahalli', available: 2, price: 1.6, type: 'outdoor', rating: 4.0, amenities: [], lat: 12.9667, lng: 77.6360 },
  ]

  // Haversine distance (km)
  function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
    const toRad = (v: number) => (v * Math.PI) / 180
    const R = 6371 // km
    const dLat = toRad(lat2 - lat1)
    const dLon = toRad(lon2 - lon1)
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const visibleLots = useMemo(() => {
    // determine center: either customCenter (user-provided) or selected area's center
    if (!selectedArea && !customCenter) return []
    const centerLat = customCenter ? customCenter[0] : parkingAreas[selectedArea as string].center[0]
    const centerLng = customCenter ? customCenter[1] : parkingAreas[selectedArea as string].center[1]
    return parkingLots
      .map(l => ({ ...l, _dist: haversine(centerLat, centerLng, l.lat, l.lng) }))
      .sort((a, b) => (a as any)._dist - (b as any)._dist)
      .slice(0, 7)
  }, [selectedArea, customCenter])


  // Booking state
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingMessage, setBookingMessage] = useState<string | null>(null)
  const [vehicleNumber, setVehicleNumber] = useState<string>('')
  const [bookingResult, setBookingResult] = useState<any | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<string>('card')
  const [showPaymentForm, setShowPaymentForm] = useState(false)

  async function createBooking(payload: any) {
    setBookingLoading(true)
    setBookingMessage(null)
    try {
      console.log('[client] creating booking payload:', payload)
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      console.log('[client] booking response status:', res.status)
      const data = await res.json()
      console.log('[client] booking response data:', data)
      if (!res.ok || !data?.success) {
        console.error('[client] booking failed response:', data)
        throw new Error(data?.error || 'Booking failed')
      }
      console.log('[client] setting booking result:', data.data)
      setBookingResult(data.data ?? { message: data.message })
      setShowPaymentForm(true)
      // Keep lot selected to show payment form
    } catch (err: any) {
      setBookingMessage('✗ ' + (err?.message || 'Failed to create booking'))
    } finally {
      setBookingLoading(false)
    }
  }

  async function completePayment() {
    console.log('[client] completePayment called, bookingResult:', bookingResult)
    if (!bookingResult?.id) {
      console.error('[client] bookingResult.id is missing:', bookingResult)
      return
    }
    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 1,
          booking_id: bookingResult.id,
          amount: selectedLot?.price * selectedDuration,
          payment_method: paymentMethod,
          status: 'completed'
        })
      })
      const data = await res.json()
      console.log('[client] payment response:', data)
      if (!res.ok || !data?.success) throw new Error('Payment failed')
      setBookingMessage('✓ Booking Done Successfully!')
      setTimeout(() => {
        console.log('[client] redirecting to /bookings/', bookingResult.id)
        router.push(`/bookings/${bookingResult.id}`)
      }, 2000)
    } catch (err: any) {
      setBookingMessage('✗ ' + (err?.message || 'Payment failed'))
    }
  }

  // Map center to use
  const mapCenter: [number, number] = customCenter ? customCenter : selectedArea ? parkingAreas[selectedArea].center : [12.9716, 77.5946]

  return (
    <div className="h-full">
      {!selectedArea && !customCenter ? (
        <div className="p-4">
          <h3 className="text-lg font-semibold">Where are you now?</h3>
          <p className="text-sm text-muted-foreground mt-1">Provide your location to see nearby parking lots.</p>
            <div className="mt-3 flex gap-2">
            <button onClick={() => {
              if (!navigator?.geolocation) return alert('Geolocation not available')
              setGeoLoading(true)
              navigator.geolocation.getCurrentPosition(pos => {
                setCustomCenter([pos.coords.latitude, pos.coords.longitude])
                setGeoLoading(false)
              }, err => { setGeoLoading(false); alert('Failed to get location: ' + err.message) })
            }} className="px-4 py-2 bg-primary text-white rounded">{geoLoading ? 'Locating…' : 'Use my location'}</button>
            <button onClick={() => setSelectedArea('Downtown')} className="px-4 py-2 border rounded">Or pick an area</button>
          </div>
          <div className="mt-4 text-sm">
            <div className="font-medium">Or enter coordinates (lat, lng)</div>
            <div className="flex gap-2 mt-2">
              <input placeholder="12.9716" className="px-2 py-1 border rounded w-32" id="latInput" />
              <input placeholder="77.5946" className="px-2 py-1 border rounded w-32" id="lngInput" />
              <button className="px-3 py-1 border rounded" onClick={() => {
                const lat = parseFloat((document.getElementById('latInput') as HTMLInputElement).value)
                const lng = parseFloat((document.getElementById('lngInput') as HTMLInputElement).value)
                if (!isFinite(lat) || !isFinite(lng)) return alert('Enter valid coords')
                setCustomCenter([lat, lng])
              }}>Set</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 h-96">
            <RMapContainer center={mapCenter} zoom={13} className="w-full h-full rounded">
              <RTileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {visibleLots.map(lot => {
                const lat = lot.lat
                const lng = lot.lng
                const isStation = /station/i.test(lot.name)
                const isFull = lot.available === 0
                const stroke = isFull ? '#dc2626' : isStation ? '#e11d48' : '#16a34a'
                const fill = isFull ? '#dc2626' : isStation ? '#fecaca' : '#16a34a'
                return (
                  <RCircleMarker key={lot.id} center={[lat, lng]} radius={10} pathOptions={{ color: stroke, fillColor: fill, fillOpacity: 1, weight: isStation ? 3 : 1 }} eventHandlers={{ click: () => setSelectedLot(lot) }}>
                    <RPopup>
                      <div className="font-semibold">{lot.name}</div>
                      <div className="text-sm">Available: {lot.available}</div>
                      <div className="text-sm">Distance: {((lot as any)._dist ?? 0).toFixed(2)} km</div>
                    </RPopup>
                  </RCircleMarker>
                )
              })}
            </RMapContainer>
          </div>

          <div className="bg-card p-4 rounded overflow-y-auto max-h-96">
            {selectedLot ? (
              <>
                <h4 className="font-semibold text-lg">{selectedLot.name}</h4>
                <p className="text-sm text-muted-foreground">{selectedLot.address}</p>
                
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between"><span>Price/hr:</span> <span className="font-semibold">${selectedLot.price.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Available:</span> <span className="font-semibold">{selectedLot.available}</span></div>
                  <div className="flex justify-between"><span>Distance:</span> <span className="font-semibold">{((selectedLot as any)._dist ?? 0).toFixed(2)} km</span></div>
                </div>

                {!showPaymentForm ? (
                  <>
                    <div className="mt-4">
                      <div className="text-sm font-medium mb-2">Duration</div>
                      <div className="flex gap-2">{[1,2,3,4].map(h => (
                        <button key={h} onClick={() => setSelectedDuration(h)} className={`px-2 py-1 border rounded text-sm ${selectedDuration===h ? 'bg-primary text-white' : ''}`}>{h}h</button>
                      ))}</div>
                    </div>

                    <div className="mt-4">
                      <label className="text-sm font-medium">Vehicle number *</label>
                      <input value={vehicleNumber} onChange={(e) => setVehicleNumber(e.target.value)} placeholder="KA-01-AB-1234" className="w-full mt-1 px-3 py-2 border rounded text-sm" />
                      {!vehicleNumber.trim() && <p className="text-xs text-red-500 mt-1">Vehicle number is required</p>}
                    </div>

                    <div className="mt-4 bg-blue-50 dark:bg-blue-950 p-3 rounded">
                      <div className="text-sm font-semibold">Total Amount</div>
                      <div className="text-2xl font-bold text-primary">${(selectedLot.price * selectedDuration).toFixed(2)}</div>
                    </div>

                    <Button className="mt-4 w-full" disabled={bookingLoading || !vehicleNumber.trim()} onClick={async () => {
                      if (!selectedLot) return
                      const durationMinutes = selectedDuration * 60
                      const total = +(selectedLot.price * selectedDuration).toFixed(2)
                      const payload = {
                        user_id: 1,
                        slot_id: 1,
                        lot_id: selectedLot.id,
                        start_time: new Date().toISOString(),
                        expected_duration_minutes: durationMinutes,
                        vehicle_number: vehicleNumber,
                        total_amount: total
                      }
                      await createBooking(payload)
                    }}>
                      {bookingLoading ? 'Creating Booking…' : <><Navigation className="w-4 h-4 mr-2 inline-block"/> Continue to Payment</>}
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="mt-4 bg-blue-50 dark:bg-blue-950 p-3 rounded border border-blue-200 dark:border-blue-800">
                      <div className="text-sm font-semibold text-blue-900 dark:text-blue-200">⏳ Booking Confirmed!</div>
                      <div className="text-sm text-blue-800 dark:text-blue-300">ID: {bookingResult?.id || 'pending'}</div>
                      <div className="text-xs text-blue-700 dark:text-blue-400 mt-1">Complete payment to finalize</div>
                    </div>

                    <div className="mt-3">
                      <label className="text-sm font-medium">Vehicle number</label>
                      <div className="w-full mt-1 px-3 py-2 border rounded text-sm bg-gray-50 dark:bg-gray-900">{vehicleNumber}</div>
                    </div>

                    <div className="mt-4">
                      <div className="text-sm font-medium mb-2">Payment Method</div>
                      <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full px-3 py-2 border rounded text-sm">
                        <option value="card">Credit/Debit Card</option>
                        <option value="wallet">Wallet</option>
                        <option value="upi">UPI</option>
                        <option value="netbanking">Net Banking</option>
                      </select>
                    </div>

                    <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-800 rounded">
                      <div className="text-sm">Amount due:</div>
                      <div className="text-2xl font-bold">${(selectedLot.price * selectedDuration).toFixed(2)}</div>
                    </div>

                    <Button className="mt-4 w-full bg-green-600 hover:bg-green-700" onClick={completePayment}>
                      Complete Payment
                    </Button>

                    <Button className="mt-2 w-full variant-outline" onClick={() => {
                      setShowPaymentForm(false)
                      setBookingResult(null)
                    }}>
                      Back to Booking
                    </Button>
                  </>
                )}

                {bookingMessage && (
                  <div className={`mt-3 text-sm p-2 rounded ${bookingMessage.includes('✓') ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'}`}>
                    {bookingMessage}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Select a parking lot on the map to book</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
