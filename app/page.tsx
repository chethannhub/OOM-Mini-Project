import Header from '@/components/home/header'
import HeroSection from '@/components/home/hero-section'
import ParkingOverview from '@/components/home/parking-overview'
import FeaturesSection from '@/components/home/features-section'
import StatsSection from '@/components/home/stats-section'
import CTASection from '@/components/home/cta-section'
import Footer from '@/components/home/footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      <Header />
      <HeroSection />
      <ParkingOverview />
      <FeaturesSection />
      <StatsSection />
      <CTASection />
      <Footer />
    </main>
  )
}
