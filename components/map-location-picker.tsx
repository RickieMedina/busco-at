'use client'

import React, { useState, useCallback } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


// Define the icon for the marker
const icon = L.icon({
  iconUrl: "/marker-icon.png?height=25&width=25",
  iconSize: [25, 35],
  iconAnchor: [12,20],
  popupAnchor: [1, -34],
})


// Define the props for the component
interface MapLocationPickerProps {
  onLocationConfirm: (lat: number, lng: number) => void
}

// Component to handle map clicks and update marker position
function MapClickHandler({ onMapClick }: { onMapClick: (latlng: L.LatLng) => void }) {
  useMapEvents({
    click(e: any) {
      onMapClick(e.latlng)
    },
  })
  return null
}

export default function MapLocationPicker({ onLocationConfirm }: MapLocationPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [markerPosition, setMarkerPosition] = useState<L.LatLng | null>(null)

  const handleMapClick = useCallback((latlng: L.LatLng) => {
    setMarkerPosition(latlng)
  }, [])

  const handleConfirm = useCallback(() => {
    if (markerPosition) {
      onLocationConfirm(markerPosition.lat, markerPosition.lng)
      setIsOpen(false)
    }
  }, [markerPosition, onLocationConfirm])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">Agregar ubicación</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Seleccione ubicación</DialogTitle>
        </DialogHeader>
        <div className="h-[400px] w-full">
          <MapContainer center={[-31.4135, -64.18105]} zoom={15} className="h-full">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MapClickHandler onMapClick={handleMapClick} />
            {markerPosition && <Marker position={markerPosition} icon={icon} />}
          </MapContainer>
        </div>
        <div className="flex justify-end mt-4">
          <Button onClick={handleConfirm} disabled={!markerPosition}>Confirmar</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}