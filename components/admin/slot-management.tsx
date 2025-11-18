"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit2, Trash2, AlertCircle } from 'lucide-react'

export default function SlotManagement() {
  const [slots, setSlots] = useState([
    {
      id: 'A-001',
      lotName: 'Downtown Plaza',
      slotNumber: 'A-01',
      type: 'standard',
      status: 'available',
      occupant: null,
      lastUpdated: '2 min ago'
    },
    {
      id: 'A-002',
      lotName: 'Downtown Plaza',
      slotNumber: 'A-02',
      type: 'standard',
      status: 'booked',
      occupant: 'John Doe',
      lastUpdated: '15 min ago'
    },
    {
      id: 'A-003',
      lotName: 'Downtown Plaza',
      slotNumber: 'A-03',
      type: 'ev',
      status: 'available',
      occupant: null,
      lastUpdated: '1 min ago'
    },
    {
      id: 'B-001',
      lotName: 'Central Station',
      slotNumber: 'B-01',
      type: 'standard',
      status: 'maintenance',
      occupant: null,
      lastUpdated: '30 min ago'
    }
  ])

  const [selectedSlots, setSelectedSlots] = useState([])

  const statusColors = {
    available: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
    booked: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
    maintenance: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
    reserved: 'bg-purple-500/10 text-purple-700 dark:text-purple-400'
  }

  const toggleSlot = (id) => {
    setSelectedSlots(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Slot Management</h1>
          <p className="text-muted-foreground">Configure and monitor parking slots</p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
          <Plus className="w-4 h-4 mr-2" />
          Add Slot
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Slots', value: 800, color: 'text-blue-600' },
          { label: 'Available', value: 320, color: 'text-emerald-600' },
          { label: 'Booked', value: 450, color: 'text-blue-600' },
          { label: 'Maintenance', value: 30, color: 'text-amber-600' }
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Parking Lot</label>
              <select className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm">
                <option>All Lots</option>
                <option>Downtown Plaza</option>
                <option>Central Station</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <select className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm">
                <option>All Status</option>
                <option>Available</option>
                <option>Booked</option>
                <option>Maintenance</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Type</label>
              <select className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm">
                <option>All Types</option>
                <option>Standard</option>
                <option>EV Charging</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Slots Table */}
      <Card>
        <CardHeader>
          <CardTitle>Parking Slots</CardTitle>
          <CardDescription>
            {selectedSlots.length > 0 && `${selectedSlots.length} selected`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4">
                    <input type="checkbox" className="rounded" />
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Slot ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Lot</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Occupant</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Updated</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {slots.map((slot) => (
                  <tr key={slot.id} className="border-b border-border hover:bg-muted/40 transition">
                    <td className="py-4 px-4">
                      <input
                        type="checkbox"
                        checked={selectedSlots.includes(slot.id)}
                        onChange={() => toggleSlot(slot.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="py-4 px-4 font-bold text-primary">{slot.id}</td>
                    <td className="py-4 px-4 text-sm">{slot.lotName}</td>
                    <td className="py-4 px-4">
                      <Badge variant="outline" className="text-xs">
                        {slot.type === 'ev' ? '⚡ EV Charging' : '🅿️ Standard'}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={statusColors[slot.status]}>
                        {slot.status.charAt(0).toUpperCase() + slot.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-sm text-muted-foreground">
                      {slot.occupant || '—'}
                    </td>
                    <td className="py-4 px-4 text-xs text-muted-foreground">{slot.lastUpdated}</td>
                    <td className="py-4 px-4 flex gap-2">
                      <Button size="sm" variant="ghost" className="text-xs">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-xs text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedSlots.length > 0 && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{selectedSlots.length} slots selected</p>
              <div className="flex gap-3">
                <Button size="sm" variant="outline">
                  Mark as Available
                </Button>
                <Button size="sm" variant="outline" className="text-amber-600">
                  Mark as Maintenance
                </Button>
                <Button size="sm" variant="outline" className="text-red-600">
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
