"use client"

import { useEffect, useState } from 'react'

export default function StatsSection() {
  const [stats, setStats] = useState([
    { label: "Active Users", value: 0, target: 500000 },
    { label: "Spots Available", value: 0, target: 250000 },
    { label: "Time Saved/Month", value: 0, target: 1500000 },
    { label: "Cities Covered", value: 0, target: 45 }
  ])

  useEffect(() => {
    const intervals = stats.map((stat, i) => {
      return setInterval(() => {
        setStats(prev => {
          const updated = [...prev]
          if (updated[i].value < updated[i].target) {
            updated[i].value += Math.ceil(updated[i].target / 50)
          }
          return updated
        })
      }, 30)
    })

    return () => intervals.forEach(interval => clearInterval(interval))
  }, [])

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K'
    return num.toFixed(0)
  }

  return (
    <section id="stats" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-border">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <div key={i} className="text-center space-y-2">
            <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {formatNumber(Math.min(stat.value, stat.target))}
              {stat.label === "Cities Covered" && "+"}
            </div>
            <p className="text-muted-foreground font-medium">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
