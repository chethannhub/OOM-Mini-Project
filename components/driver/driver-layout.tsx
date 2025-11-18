"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { MapPin, Clock, CreditCard, User, Menu, X } from 'lucide-react'

export default function DriverLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg hidden sm:inline">ParkNow</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/driver" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition">
              <MapPin className="w-4 h-4" />
              Find Parking
            </Link>
            <Link href="/driver/bookings" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition">
              <Clock className="w-4 h-4" />
              My Bookings
            </Link>
            <Link href="/driver/payments" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition">
              <CreditCard className="w-4 h-4" />
              Payments
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Button size="sm" variant="ghost" className="hidden sm:inline-flex">
              <User className="w-4 h-4 mr-2" />
              Profile
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-card p-4 space-y-3">
            <Link href="/driver" className="flex items-center gap-2 text-sm font-medium p-2 hover:bg-muted rounded-lg">
              <MapPin className="w-4 h-4" />
              Find Parking
            </Link>
            <Link href="/driver/bookings" className="flex items-center gap-2 text-sm font-medium text-muted-foreground p-2 hover:bg-muted rounded-lg">
              <Clock className="w-4 h-4" />
              My Bookings
            </Link>
            <Link href="/driver/payments" className="flex items-center gap-2 text-sm font-medium text-muted-foreground p-2 hover:bg-muted rounded-lg">
              <CreditCard className="w-4 h-4" />
              Payments
            </Link>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  )
}
