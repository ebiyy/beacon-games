'use client'

import { useEffect } from 'react'
import maplibregl from 'maplibre-gl'

export interface EmergencyUnit {
  id: string
  type: 'police' | 'fire' | 'ambulance'
  position: [number, number]
  status: 'available' | 'responding' | 'busy'
  callSign: string
}

export interface Incident {
  id: string
  type: 'fire' | 'medical' | 'crime' | 'accident'
  position: [number, number]
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  timestamp: Date
}

interface EmergencyUnitsProps {
  map: maplibregl.Map | null
  units: EmergencyUnit[]
  incidents: Incident[]
}

const unitIcons = {
  police: '🚓',
  fire: '🚒',
  ambulance: '🚑',
}

const incidentIcons = {
  fire: '🔥',
  medical: '🏥',
  crime: '🚨',
  accident: '💥',
}

const statusColors = {
  available: '#22c55e',
  responding: '#f59e0b',
  busy: '#ef4444',
}

const severityColors = {
  low: '#3b82f6',
  medium: '#f59e0b',
  high: '#ef4444',
  critical: '#991b1b',
}

export default function EmergencyUnits({ map, units, incidents }: EmergencyUnitsProps) {
  useEffect(() => {
    if (!map) return

    // Add units as markers
    units.forEach((unit) => {
      const el = document.createElement('div')
      el.className = 'emergency-unit-marker'
      el.innerHTML = `
        <div class="relative">
          <div class="absolute -inset-1 rounded-full opacity-30" style="background-color: ${statusColors[unit.status]};"></div>
          <div class="relative text-2xl">${unitIcons[unit.type]}</div>
        </div>
      `

      new maplibregl.Marker(el)
        .setLngLat(unit.position)
        .setPopup(
          new maplibregl.Popup({ offset: 25 }).setHTML(`
              <div class="p-2">
                <h3 class="font-bold">${unit.callSign}</h3>
                <p>Status: ${unit.status}</p>
              </div>
            `),
        )
        .addTo(map)
    })

    // Add incidents as markers
    incidents.forEach((incident) => {
      const el = document.createElement('div')
      el.className = 'incident-marker'
      el.innerHTML = `
        <div class="relative animate-pulse">
          <div class="absolute -inset-2 rounded-full opacity-40" style="background-color: ${severityColors[incident.severity]};"></div>
          <div class="relative text-2xl">${incidentIcons[incident.type]}</div>
        </div>
      `

      new maplibregl.Marker(el)
        .setLngLat(incident.position)
        .setPopup(
          new maplibregl.Popup({ offset: 25 }).setHTML(`
              <div class="p-2">
                <h3 class="font-bold capitalize">${incident.type} - ${incident.severity}</h3>
                <p>${incident.description}</p>
                <p class="text-xs text-gray-500">${incident.timestamp.toLocaleTimeString()}</p>
              </div>
            `),
        )
        .addTo(map)
    })

    // Cleanup function
    return () => {
      // Remove all markers when component unmounts
      const markers = document.querySelectorAll('.emergency-unit-marker, .incident-marker')
      markers.forEach((marker) => marker.remove())
    }
  }, [map, units, incidents])

  return null
}
