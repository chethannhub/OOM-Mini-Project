"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, AlertCircle, Users, ParkingSquare, Clock, DollarSign } from 'lucide-react'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']

export default function AdminDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('week')

  // Revenue Data
  const revenueData = [
    { date: 'Mon', revenue: 2400, bookings: 120 },
    { date: 'Tue', revenue: 3200, bookings: 145 },
    { date: 'Wed', revenue: 2800, bookings: 135 },
    { date: 'Thu', revenue: 3800, bookings: 160 },
    { date: 'Fri', revenue: 4200, bookings: 180 },
    { date: 'Sat', revenue: 3600, bookings: 150 },
    { date: 'Sun', revenue: 3000, bookings: 140 }
  ]

  // Availability Data
  const availabilityData = [
    { name: 'Available', value: 450, color: '#10b981' },
    { name: 'Booked', value: 280, color: '#3b82f6' },
    { name: 'Maintenance', value: 70, color: '#f59e0b' }
  ]

  // Parking Lots Data
  const parkingLots = [
    {
      id: 1,
      name: 'Downtown Plaza',
      slots: 120,
      available: 24,
      booked: 85,
      maintenance: 11,
      occupancy: 71,
      revenue: 8400,
      status: 'operational'
    },
    {
      id: 2,
      name: 'Central Station',
      slots: 200,
      available: 45,
      booked: 145,
      maintenance: 10,
      occupancy: 73,
      revenue: 12800,
      status: 'operational'
    },
    {
      id: 3,
      name: 'Mall Parking',
      slots: 150,
      available: 12,
      booked: 132,
      maintenance: 6,
      occupancy: 88,
      revenue: 9600,
      status: 'high-demand'
    },
    {
      id: 4,
      name: 'Business District',
      slots: 180,
      available: 67,
      booked: 98,
      maintenance: 15,
      occupancy: 54,
      revenue: 10200,
      status: 'operational'
    }
  ]

  // KPI Cards
  const kpis = [
    {
      title: 'Total Revenue',
      value: '$22,400',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-emerald-500 to-teal-600'
    },
    {
      title: 'Total Bookings',
      value: '870',
      change: '+18.2%',
      trend: 'up',
      icon: ParkingSquare,
      color: 'from-blue-500 to-cyan-600'
    },
    {
      title: 'Active Users',
      value: '3,420',
      change: '+5.1%',
      trend: 'up',
      icon: Users,
      color: 'from-purple-500 to-pink-600'
    },
    {
      title: 'Avg. Duration',
      value: '2.5h',
      change: '-2.3%',
      trend: 'down',
      icon: Clock,
      color: 'from-orange-500 to-red-600'
    }
  ]

  return (
    <div className="p-6 space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <Card key={i} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground font-medium">{kpi.title}</p>
                  <p className="text-2xl font-bold">{kpi.value}</p>
                  <p className={`text-xs font-semibold ${kpi.trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {kpi.change}
                  </p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-br ${kpi.color} rounded-lg flex items-center justify-center opacity-90`}>
                  <kpi.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue & Bookings</CardTitle>
            <CardDescription>Weekly performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="date" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="revenue" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
                <Bar dataKey="bookings" fill="var(--color-accent)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Availability Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Slot Availability</CardTitle>
            <CardDescription>Current status</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={availabilityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {availabilityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} slots`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {availabilityData.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Parking Lots Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Parking Lots Management</CardTitle>
            <CardDescription>Monitor all parking locations</CardDescription>
          </div>
          <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
            + Add New Lot
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-sm">Location</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Total Slots</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Available</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Booked</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Occupancy</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Revenue</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {parkingLots.map((lot) => (
                  <tr key={lot.id} className="border-b border-border hover:bg-muted/40 transition">
                    <td className="py-4 px-4 font-medium">{lot.name}</td>
                    <td className="py-4 px-4">{lot.slots}</td>
                    <td className="py-4 px-4">
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                        {lot.available}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-700 dark:text-blue-400">
                        {lot.booked}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="w-16 bg-muted rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            lot.occupancy > 80
                              ? 'bg-red-500'
                              : lot.occupancy > 50
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${lot.occupancy}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-muted-foreground">{lot.occupancy}%</span>
                    </td>
                    <td className="py-4 px-4 font-semibold text-primary">${lot.revenue.toLocaleString()}</td>
                    <td className="py-4 px-4">
                      <Badge
                        className={
                          lot.status === 'high-demand'
                            ? 'bg-red-500/10 text-red-700 dark:text-red-400'
                            : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                        }
                      >
                        {lot.status === 'high-demand' ? '⚠️ High Demand' : '✓ Operational'}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Button size="sm" variant="ghost" className="text-xs">
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Alerts Section */}
      <Card className="border-amber-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <AlertCircle className="w-5 h-5" />
            System Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { message: 'Mall Parking lot is at 88% capacity - Consider increasing rates', priority: 'high' },
              { message: '5 payment processing failures detected - Check with payment provider', priority: 'medium' },
              { message: 'Central Station maintenance scheduled for tomorrow at 2 AM', priority: 'info' }
            ].map((alert, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-muted/40 rounded-lg border border-border">
                <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                  alert.priority === 'high' ? 'text-red-500' : 'text-amber-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm">{alert.message}</p>
                </div>
                <Button size="sm" variant="ghost">
                  Dismiss
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
