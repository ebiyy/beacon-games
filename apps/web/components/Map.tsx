'use client'

import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

export default function Map() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map | null>(null)

  useEffect(() => {
    if (map.current) return // Initialize map only once
    if (!mapContainer.current) return

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '&copy; OpenStreetMap Contributors',
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
      center: [139.767, 35.6813], // Tokyo
      zoom: 12,
    })

    // Add navigation control
    map.current.addControl(new maplibregl.NavigationControl(), 'top-right')

    // Clean up on unmount
    return () => {
      map.current?.remove()
    }
  }, [])

  return <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
}
