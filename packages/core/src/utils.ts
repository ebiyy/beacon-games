import type { Position } from './types'

export function calculateDistance(pos1: Position, pos2: Position): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = toRad(pos2.lat - pos1.lat)
  const dLng = toRad(pos2.lng - pos1.lng)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(pos1.lat)) * Math.cos(toRad(pos2.lat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180)
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}
