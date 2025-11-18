'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function PaymentHistoryPage() {
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPayments() {
      try {
        const res = await fetch('/api/payments')
        const data = await res.json()
        setPayments(data?.data || [])
      } catch (err) {
        console.error('Failed to fetch payments:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchPayments()
    // Auto-refresh every 3 seconds
    const interval = setInterval(fetchPayments, 3000)
    return () => clearInterval(interval)
  }, [])

  if (loading) return <div className="p-6">Loading...</div>

  const totalAmount = payments.reduce((sum, p) => sum + (p.amount || 0), 0)
  const successfulPayments = payments.filter(p => p.status === 'completed').length

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Payment History</h1>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-card border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">Total Payments</div>
          <div className="text-2xl font-bold">₹{totalAmount}</div>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">Successful</div>
          <div className="text-2xl font-bold">{successfulPayments}</div>
        </div>
      </div>

      {payments.length === 0 ? (
        <div>
          <p className="text-muted-foreground">No payments found.</p>
          <Link href="/driver"><Button className="mt-4">Book Now</Button></Link>
        </div>
      ) : (
        <div className="space-y-4">
          {payments.map((payment: any) => (
            <div key={payment._id?.toString() || payment.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold">Payment ID: {payment.id || payment._id?.toString()}</div>
                  <div className="text-sm text-muted-foreground">Booking ID: {payment.booking_id}</div>
                  <div className="text-sm mt-1">Amount: ₹{payment.amount}</div>
                  <div className="text-sm">Method: {payment.payment_method || 'N/A'}</div>
                  <div className="text-sm">Date: {new Date(payment.created_at).toLocaleString()}</div>
                  <div className="text-sm font-semibold mt-1">Status: <span className={`font-medium ${payment.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>{payment.status}</span></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
