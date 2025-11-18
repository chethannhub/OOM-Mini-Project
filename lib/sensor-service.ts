import { IoTSensorSimulator } from './iot-simulator'

let sensorSimulator: IoTSensorSimulator | null = null

export function initSensorSimulator() {
  if (!sensorSimulator) {
    sensorSimulator = new IoTSensorSimulator()
  }
  return sensorSimulator
}

export function getSensorSimulator() {
  if (!sensorSimulator) {
    sensorSimulator = initSensorSimulator()
  }
  return sensorSimulator
}

export async function startRealtimeSensorUpdates(callback: (data: any) => void) {
  const simulator = getSensorSimulator()
  simulator.startSimulation(callback)
}

export function stopSensorUpdates() {
  const simulator = getSensorSimulator()
  simulator.stopSimulation()
}

export async function getLotOccupancyStats(lotId: number) {
  const simulator = getSensorSimulator()
  return simulator.getOccupancyStats(lotId)
}

export async function getSystemHealth() {
  const simulator = getSensorSimulator()
  return simulator.getSystemHealth()
}

export async function getSensorState(sensorId: string) {
  const simulator = getSensorSimulator()
  return simulator.getSensorState(sensorId)
}
