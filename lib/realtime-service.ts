import { useState, useEffect, useRef, useCallback } from 'react'

interface RealtimeSubscriber {
  id: string
  callback: (data: any) => void
}

class RealtimeService {
  private subscribers: Map<string, RealtimeSubscriber[]> = new Map()
  private updateInterval: NodeJS.Timeout | null = null
  private pollingCallbacks: Map<string, (() => Promise<any>)[]> = new Map()

  /**
   * Subscribe to real-time updates for a specific channel
   * @param channel - Channel name (e.g., 'lot-1-occupancy', 'bookings-user-123')
   * @param callback - Function called when data updates
   * @returns Unsubscribe function
   */
  public subscribe(channel: string, callback: (data: any) => void): () => void {
    if (!this.subscribers.has(channel)) {
      this.subscribers.set(channel, [])
    }

    const subscriberId = `sub-${Date.now()}-${Math.random()}`
    const subscriber = { id: subscriberId, callback }

    this.subscribers.get(channel)!.push(subscriber)

    // Return unsubscribe function
    return () => {
      const subs = this.subscribers.get(channel)
      if (subs) {
        const index = subs.findIndex(s => s.id === subscriberId)
        if (index > -1) {
          subs.splice(index, 1)
        }
      }
    }
  }

  /**
   * Publish updates to all subscribers of a channel
   */
  public publish(channel: string, data: any) {
    const subscribers = this.subscribers.get(channel)
    if (subscribers) {
      subscribers.forEach(sub => {
        try {
          sub.callback(data)
        } catch (error) {
          console.error('Error in subscriber callback:', error)
        }
      })
    }
  }

  /**
   * Register a polling function for a channel
   */
  public registerPolling(channel: string, pollFn: () => Promise<any>) {
    if (!this.pollingCallbacks.has(channel)) {
      this.pollingCallbacks.set(channel, [])
    }
    this.pollingCallbacks.get(channel)!.push(pollFn)
  }

  /**
   * Start polling all registered channels
   */
  public startPolling(interval: number = 3000) {
    this.updateInterval = setInterval(async () => {
      for (const [channel, callbacks] of this.pollingCallbacks.entries()) {
        for (const callback of callbacks) {
          try {
            const data = await callback()
            this.publish(channel, data)
          } catch (error) {
            console.error(`Polling error on channel ${channel}:`, error)
          }
        }
      }
    }, interval)
  }

  /**
   * Stop polling
   */
  public stopPolling() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
      this.updateInterval = null
    }
  }

  /**
   * Get subscriber count for debugging
   */
  public getChannelStats() {
    const stats: Record<string, number> = {}
    this.subscribers.forEach((subs, channel) => {
      stats[channel] = subs.length
    })
    return stats
  }
}

export const realtimeService = new RealtimeService()

/**
 * React hook for real-time updates
 */
export function useRealtime<T>(channel: string, initialValue: T) {
  const [data, setData] = useState<T>(initialValue)
  const unsubscribeRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    unsubscribeRef.current = realtimeService.subscribe(channel, (newData) => {
      setData(newData)
    })

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current()
      }
    }
  }, [channel])

  return data
}
