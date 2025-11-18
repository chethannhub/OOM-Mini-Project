export class IoTSensorSimulator {
  private updateInterval: NodeJS.Timeout | null = null
  private sensorStates: Map<string, any> = new Map()

  constructor() {
    this.initializeSensors()
  }

  private initializeSensors() {
    // Initialize 650 sensors for the parking lots
    for (let lotId = 1; lotId <= 4; lotId++) {
      const slotsPerLot = [120, 200, 150, 180][lotId - 1]
      for (let i = 1; i <= slotsPerLot; i++) {
        const sensorId = `SENSOR-${lotId}-${i}`
        this.sensorStates.set(sensorId, {
          sensor_id: sensorId,
          lot_id: lotId,
          slot_number: i,
          occupancy: Math.random() < 0.65 ? 'occupied' : 'empty',
          signal_strength: Math.floor(Math.random() * 40) + 60, // 60-100
          battery_level: Math.floor(Math.random() * 30) + 70, // 70-100
          temperature: Math.floor(Math.random() * 10) + 20, // 20-30°C
          last_update: new Date()
        })
      }
    }
  }

  // Start simulating sensor updates
  public startSimulation(callback: (data: any) => void) {
    this.updateInterval = setInterval(() => {
      // Update 5-10 random sensors per interval to simulate real-world activity
      const updateCount = Math.floor(Math.random() * 6) + 5
      const sensorIds = Array.from(this.sensorStates.keys())

      for (let i = 0; i < updateCount; i++) {
        const randomSensorId = sensorIds[Math.floor(Math.random() * sensorIds.length)]
        const sensorState = this.sensorStates.get(randomSensorId)

        // 30% chance to change occupancy (vehicles coming/leaving)
        if (Math.random() < 0.3) {
          sensorState.occupancy = sensorState.occupancy === 'occupied' ? 'empty' : 'occupied'
        }

        // Slight variations in other readings
        sensorState.signal_strength = Math.max(50, Math.min(100, sensorState.signal_strength + (Math.random() - 0.5) * 10))
        sensorState.battery_level = Math.max(20, sensorState.battery_level - Math.random() * 0.1)
        sensorState.temperature = 20 + Math.sin(Date.now() / 1000000) * 5 + Math.random() * 2
        sensorState.last_update = new Date()

        callback(sensorState)
      }
    }, 3000) // Update every 3 seconds
  }

  public stopSimulation() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
      this.updateInterval = null
    }
  }

  // Get current state of a sensor
  public getSensorState(sensorId: string) {
    return this.sensorStates.get(sensorId)
  }

  // Get all sensors for a lot
  public getLotSensors(lotId: number) {
    const sensors: any[] = []
    this.sensorStates.forEach((value) => {
      if (value.lot_id === lotId) {
        sensors.push(value)
      }
    })
    return sensors
  }

  // Get occupancy statistics
  public getOccupancyStats(lotId: number) {
    const lotSensors = this.getLotSensors(lotId)
    const occupied = lotSensors.filter(s => s.occupancy === 'occupied').length
    const empty = lotSensors.filter(s => s.occupancy === 'empty').length

    return {
      lot_id: lotId,
      total_slots: lotSensors.length,
      occupied_slots: occupied,
      available_slots: empty,
      occupancy_rate: ((occupied / lotSensors.length) * 100).toFixed(2)
    }
  }

  // Simulate sensor malfunction
  public simulateSensorError(sensorId: string, errorMessage: string) {
    const sensorState = this.sensorStates.get(sensorId)
    if (sensorState) {
      sensorState.error_status = errorMessage
      sensorState.battery_level = Math.random() * 10 // Very low battery
    }
  }

  // Get system health report
  public getSystemHealth() {
    const allSensors = Array.from(this.sensorStates.values())
    const healthySensors = allSensors.filter(s => !s.error_status && s.battery_level > 20).length
    const lowBatterySensors = allSensors.filter(s => s.battery_level < 30).length
    const failedSensors = allSensors.filter(s => s.error_status).length

    return {
      total_sensors: allSensors.length,
      healthy_sensors: healthySensors,
      low_battery_sensors: lowBatterySensors,
      failed_sensors: failedSensors,
      system_health_percentage: ((healthySensors / allSensors.length) * 100).toFixed(2)
    }
  }
}
