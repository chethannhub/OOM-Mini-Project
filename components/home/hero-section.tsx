"use client"

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { MapPin, Navigation, Clock, BarChart3 } from 'lucide-react'

export default function HeroSection() {
  const router = useRouter()
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 animate-slide-up">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-pretty">
              <span className="text-foreground">Find Your Perfect Spot</span>
              <br />
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                in Seconds
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-xl">
              Real-time parking availability, instant booking, and smart navigation. Reduce search time by up to 30 minutes and cut fuel consumption in half.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg h-12"
              onClick={() => router.push('/driver')}
            >
              Book Parking Now
            </Button>
            <Button size="lg" variant="outline" className="text-lg h-12">
              Watch Demo
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4">
            {[
              { icon: MapPin, label: "Real-Time", value: "Available" },
              { icon: Navigation, label: "Smart", value: "Navigation" },
              { icon: Clock, label: "Save", value: "30 Min" }
            ].map((item, i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-4 space-y-2">
                <item.icon className="w-5 h-5 text-accent" />
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="font-semibold text-foreground">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative h-96 lg:h-full min-h-96">
          <img 
            src="/modern-parking-lot-with-cars-and-empty-spaces.jpg"
            alt="Smart parking system interface"
            className="w-full h-full object-cover rounded-2xl shadow-2xl border border-border"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent rounded-2xl"></div>
        </div>
      </div>
    </section>
  )
}
