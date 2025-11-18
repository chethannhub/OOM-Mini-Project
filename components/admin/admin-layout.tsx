"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X, LogOut, Settings, BarChart3, ParkingSquare, Users, Clock } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const navigationItems = [
    { icon: BarChart3, label: 'Dashboard', href: '/admin', badge: null },
    { icon: ParkingSquare, label: 'Slots Management', href: '/admin/slots', badge: '12' },
    { icon: Clock, label: 'Bookings', href: '/admin/bookings', badge: '24' },
    { icon: Users, label: 'Users', href: '/admin/users', badge: null },
    { icon: BarChart3, label: 'Analytics', href: '/admin/analytics', badge: null },
    { icon: Settings, label: 'Settings', href: '/admin/settings', badge: null },
  ]

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} border-r border-border bg-card transition-all duration-300 flex flex-col`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <ParkingSquare className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">ParkNow Admin</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-muted rounded-lg transition"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
          {navigationItems.map((item, i) => (
            <Link
              key={i}
              href={item.href}
              className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg hover:bg-muted transition group relative"
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition" />
                {sidebarOpen && (
                  <span className="text-sm font-medium group-hover:text-primary transition">{item.label}</span>
                )}
              </div>
              {sidebarOpen && item.badge && (
                <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="border-t border-border p-4">
          <Button size="sm" variant="outline" className="w-full" onClick={() => alert('Logged out')}>
            {sidebarOpen ? (
              <>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </>
            ) : (
              <LogOut className="w-4 h-4" />
            )}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="border-b border-border bg-card h-16 px-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-muted rounded-lg transition">
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.5 1.5H9.5V.5h1v1zm0 17h-1v1h1v-1zm6.78-4.22a1 1 0 00-1.415 1.415l.707.707a1 1 0 001.415-1.415l-.707-.707zM4.464 4.464a1 1 0 00-1.415 1.415l.707.707a1 1 0 001.415-1.415L4.464 4.464zm0 10.07l-.707.708a1 1 0 101.415 1.415l.707-.707a1 1 0 00-1.415-1.415zm10.07-10.07a1 1 0 10-1.415-1.415l-.707.707a1 1 0 001.415 1.415l.707-.707zM18 10a1 1 0 110-2 1 1 0 010 2zm-17 0a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
            <div className="flex items-center gap-2 pl-4 border-l border-border">
              <div className="text-right">
                <p className="text-sm font-semibold">Admin User</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full"></div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
