"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, DollarSign, MapPin, Navigation } from 'lucide-react'

export default function BookingPanel() {
  const [bookingStep, setBookingStep] = useState('duration')
  const [selectedDuration, setSelectedDuration] = useState(2)
  const [selectedPayment, setSelectedPayment] = useState('card')

  const selectedLot = {
    id: 1,
    name: "Downtown Plaza",
    price: 2.50,
    available: 24,
    distance: 0.5
  }

  const totalPrice = selectedDuration * selectedLot.price

  const durations = [1, 2, 3, 4, 6, 12]
  const paymentMethods = [
    { id: 'card', name: 'Credit Card', icon: '💳' },
    { id: 'wallet', name: 'Digital Wallet', icon: '👛' },
    { id: 'pass', name: 'Monthly Pass', icon: '📋' }
  ]

  return (
    <Card className="sticky top-0">
      <CardHeader className="border-b border-border">
        <CardTitle className="text-lg">Quick Booking</CardTitle>
        <CardDescription>Complete your parking reservation</CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-6">
        {/* Selected Lot Info */}
        <div className="bg-muted/40 rounded-lg p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="font-semibold">{selectedLot.name}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {selectedLot.distance} km away
              </p>
            </div>
            <Badge>Available</Badge>
          </div>
          <div className="text-2xl font-bold text-primary">${selectedLot.price.toFixed(2)}/hr</div>
        </div>

        {/* Step 1: Select Duration */}
        {bookingStep === 'duration' && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold mb-3 block">How long do you need parking?</label>
              <div className="grid grid-cols-3 gap-2">
                {durations.map((duration) => (
                  <button
                    key={duration}
                    onClick={() => setSelectedDuration(duration)}
                    className={`p-3 rounded-lg border-2 transition-all font-medium text-sm ${
                      selectedDuration === duration
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-background hover:border-primary/50'
                    }`}
                  >
                    {duration}h
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-accent/10 border border-accent/20 rounded-lg p-3 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-semibold">{selectedDuration} hours</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Price per hour</span>
                <span className="font-semibold">${selectedLot.price.toFixed(2)}</span>
              </div>
              <div className="border-t border-accent/20 pt-2 flex justify-between items-center font-bold text-lg">
                <span>Total</span>
                <span className="text-primary">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <Button
              onClick={() => setBookingStep('payment')}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 h-11"
            >
              Continue to Payment
            </Button>
          </div>
        )}

        {/* Step 2: Select Payment */}
        {bookingStep === 'payment' && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold mb-3 block">Payment Method</label>
              <div className="space-y-2">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPayment(method.id)}
                    className={`w-full p-3 rounded-lg border-2 transition-all flex items-center justify-between ${
                      selectedPayment === method.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-background hover:border-primary/50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-xl">{method.icon}</span>
                      <span className="font-medium text-sm">{method.name}</span>
                    </span>
                    {selectedPayment === method.id && (
                      <span className="text-primary font-bold">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-muted/40 rounded-lg p-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal ({selectedDuration}h)</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service Fee</span>
                <span>${(totalPrice * 0.05).toFixed(2)}</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between font-bold">
                <span>Total Amount</span>
                <span className="text-primary">${(totalPrice * 1.05).toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Button
                onClick={() => setBookingStep('confirm')}
                className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 h-11"
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Proceed to Pay
              </Button>
              <Button
                onClick={() => setBookingStep('duration')}
                variant="outline"
                className="w-full"
              >
                Back
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {bookingStep === 'confirm' && (
          <div className="space-y-4 text-center">
            <div className="w-16 h-16 bg-emerald-500/10 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto">
              <span className="text-3xl">✓</span>
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-lg">Booking Confirmed!</h4>
              <p className="text-sm text-muted-foreground">Your spot is reserved</p>
            </div>

            <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 text-left space-y-3 text-sm">
              <div className="space-y-1">
                <p className="text-muted-foreground">Location</p>
                <p className="font-semibold">{selectedLot.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Duration</p>
                <p className="font-semibold">{selectedDuration} hours</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Total Cost</p>
                <p className="font-bold text-primary text-lg">${(totalPrice * 1.05).toFixed(2)}</p>
              </div>
            </div>

            <Button className="w-full bg-gradient-to-r from-accent to-secondary hover:opacity-90 h-11">
              <Navigation className="w-4 h-4 mr-2" />
              Start Navigation
            </Button>
            <Button
              onClick={() => setBookingStep('duration')}
              variant="outline"
              className="w-full"
            >
              Make Another Booking
            </Button>
          </div>
        )}

        {/* Quick Stats */}
        <div className="border-t border-border pt-4 grid grid-cols-3 gap-3 text-center text-xs">
          <div>
            <div className="font-bold text-primary">{selectedLot.available}</div>
            <div className="text-muted-foreground">Available Now</div>
          </div>
          <div>
            <div className="font-bold text-accent">4.8⭐</div>
            <div className="text-muted-foreground">Rating</div>
          </div>
          <div>
            <div className="font-bold text-secondary">24/7</div>
            <div className="text-muted-foreground">Open Hours</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
