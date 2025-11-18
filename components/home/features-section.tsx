"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, Navigation, Clock, CreditCard, Bell, BarChart3, Smartphone, Lock } from 'lucide-react'

export default function FeaturesSection() {
  const features = [
    {
      icon: MapPin,
      title: "Real-Time Availability",
      description: "See live parking spot availability updated every 30 seconds across all locations"
    },
    {
      icon: Navigation,
      title: "Smart Navigation",
      description: "Turn-by-turn directions to your booked spot with parking level guidance"
    },
    {
      icon: Clock,
      title: "Quick Booking",
      description: "Reserve parking in 3 taps and guarantee your spot for up to 2 hours"
    },
    {
      icon: CreditCard,
      title: "Flexible Payments",
      description: "Multiple payment options with competitive hourly rates and monthly passes"
    },
    {
      icon: Bell,
      title: "Smart Alerts",
      description: "Get notifications for reserved spots expiring and price drops in your area"
    },
    {
      icon: BarChart3,
      title: "Usage Analytics",
      description: "Track parking history, spending, and get insights on peak parking times"
    },
    {
      icon: Smartphone,
      title: "Mobile App",
      description: "iOS and Android apps with offline maps and voice-guided navigation"
    },
    {
      icon: Lock,
      title: "Secure & Safe",
      description: "Enterprise-grade encryption and CCTV integrated monitoring for vehicle safety"
    }
  ]

  return (
    <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold">Powerful Features</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to find and book parking with ease
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <Card key={i} className="hover:shadow-lg transition-all hover:border-accent group cursor-pointer animate-slide-up" style={{animationDelay: `${i * 50}ms`}}>
              <CardHeader>
                <feature.icon className="w-8 h-8 text-accent group-hover:text-primary transition-colors mb-2" />
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
