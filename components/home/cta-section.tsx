"use client"

import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="bg-gradient-to-r from-primary via-secondary to-accent rounded-2xl p-8 sm:p-12 lg:p-16 text-center space-y-6">
        <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground">
          Ready to Never Hunt for Parking Again?
        </h2>
        <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
          Join thousands of drivers saving time and reducing stress with ParkGrid
        </p>
        <Button 
          size="lg" 
          className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-lg h-12 w-full sm:w-auto"
        >
          Download ParkGrid Now <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </section>
  )
}
