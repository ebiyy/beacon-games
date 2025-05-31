'use client'

import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

interface EmergencyUnit {
  id: string
  type: 'police' | 'fire' | 'ambulance'
  position: [number, number]
  status: 'available' | 'responding' | 'on-scene'
  callSign: string
}

interface Incident {
  id: string
  type: 'fire' | 'medical' | 'crime' | 'accident'
  position: [number, number]
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  timestamp: Date
}

export default function MapWithMarkers() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map | null>(null)
  const [lng, setLng] = useState(139.767)
  const [lat, setLat] = useState(35.6813)
  const [zoom, setZoom] = useState(12)

  // Demo data
  const units: EmergencyUnit[] = [
    {
      id: '1',
      type: 'police',
      position: [139.777, 35.6813],
      status: 'available',
      callSign: 'P-101',
    },
    {
      id: '2',
      type: 'ambulance',
      position: [139.757, 35.6913],
      status: 'responding',
      callSign: 'A-202',
    },
    { id: '3', type: 'fire', position: [139.767, 35.6713], status: 'available', callSign: 'F-301' },
  ]

  const incidents: Incident[] = [
    {
      id: '1',
      type: 'fire',
      position: [139.787, 35.6813],
      severity: 'high',
      description: '建物火災',
      timestamp: new Date(),
    },
    {
      id: '2',
      type: 'medical',
      position: [139.747, 35.6913],
      severity: 'critical',
      description: '心臓発作',
      timestamp: new Date(),
    },
    {
      id: '3',
      type: 'accident',
      position: [139.757, 35.6613],
      severity: 'medium',
      description: '交通事故',
      timestamp: new Date(),
    },
  ]

  useEffect(() => {
    if (!mapContainer.current || map.current) return

    const mapInstance = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© OpenStreetMap Contributors',
            maxzoom: 19,
          },
        },
        layers: [
          {
            id: 'osm',
            type: 'raster',
            source: 'osm',
          },
        ],
      },
      center: [lng, lat],
      zoom: zoom,
    })

    map.current = mapInstance

    // Add navigation control
    mapInstance.addControl(new maplibregl.NavigationControl(), 'top-right')

    // Update coordinates on move
    mapInstance.on('move', () => {
      setLng(parseFloat(mapInstance.getCenter().lng.toFixed(4)))
      setLat(parseFloat(mapInstance.getCenter().lat.toFixed(4)))
      setZoom(parseFloat(mapInstance.getZoom().toFixed(2)))
    })

    // Add markers when map loads
    mapInstance.on('load', () => {
      // Add emergency unit markers
      units.forEach((unit) => {
        const el = document.createElement('div')
        el.className = 'emergency-unit-marker'
        el.style.width = '30px'
        el.style.height = '30px'
        el.style.borderRadius = '50%'
        el.style.cursor = 'pointer'

        // Set color based on unit type
        switch (unit.type) {
          case 'police':
            el.style.backgroundColor = '#3B82F6' // blue
            break
          case 'fire':
            el.style.backgroundColor = '#EF4444' // red
            break
          case 'ambulance':
            el.style.backgroundColor = '#10B981' // green
            break
        }

        new maplibregl.Marker(el)
          .setLngLat(unit.position)
          .setPopup(
            new maplibregl.Popup({ offset: 25 }).setHTML(`
                <div class="p-2">
                  <h3 class="font-bold">${unit.callSign}</h3>
                  <p>Type: ${unit.type}</p>
                  <p>Status: ${unit.status}</p>
                </div>
              `),
          )
          .addTo(mapInstance)
      })

      // Add incident markers
      incidents.forEach((incident) => {
        const el = document.createElement('div')
        el.className = 'incident-marker'
        el.style.width = '24px'
        el.style.height = '24px'
        el.style.borderRadius = '4px'
        el.style.cursor = 'pointer'
        el.style.border = '2px solid #fff'

        // Set color based on severity
        switch (incident.severity) {
          case 'low':
            el.style.backgroundColor = '#FDE047' // yellow
            break
          case 'medium':
            el.style.backgroundColor = '#FB923C' // orange
            break
          case 'high':
            el.style.backgroundColor = '#F87171' // light red
            break
          case 'critical':
            el.style.backgroundColor = '#991B1B' // dark red
            break
        }

        new maplibregl.Marker(el)
          .setLngLat(incident.position)
          .setPopup(
            new maplibregl.Popup({ offset: 25 }).setHTML(`
                <div class="p-2">
                  <h3 class="font-bold">${incident.type.toUpperCase()}</h3>
                  <p>${incident.description}</p>
                  <p>Severity: ${incident.severity}</p>
                  <p class="text-xs text-gray-500">${incident.timestamp.toLocaleTimeString()}</p>
                </div>
              `),
          )
          .addTo(mapInstance)
      })
    })

    return () => {
      map.current?.remove()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="absolute inset-0">
      <div className="absolute top-0 left-0 z-10 bg-gray-900 bg-opacity-75 text-white px-3 py-2 m-2 rounded-md text-sm">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div ref={mapContainer} className="absolute inset-0" />

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10 bg-white bg-opacity-90 p-3 rounded-md text-sm">
        <h3 className="font-bold mb-2">Legend</h3>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
            <span>Police</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span>Fire</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span>Ambulance</span>
          </div>
          <hr className="my-2" />
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-yellow-300 border-2 border-white"></div>
            <span>Low Severity</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-orange-400 border-2 border-white"></div>
            <span>Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-400 border-2 border-white"></div>
            <span>High</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-900 border-2 border-white"></div>
            <span>Critical</span>
          </div>
        </div>
      </div>
    </div>
  )
}
