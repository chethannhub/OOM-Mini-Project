import DriverLayout from '@/components/driver/driver-layout'
import ParkingMap from '@/components/driver/parking-map'
import BookingPanel from '@/components/driver/booking-panel'

export default function DriverPage() {
  return (
    <DriverLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-80px)]">
        <div className="lg:col-span-2">
          <ParkingMap />
        </div>
        <div className="hidden lg:block overflow-y-auto">
          <BookingPanel />
        </div>
      </div>
    </DriverLayout>
  )
}
