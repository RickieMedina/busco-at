'use client'

import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect } from 'react'
import { Card, CardContent } from './ui/card'

interface MapProps {
  latitud?: number
  longitud?: number
  mapHeight?: number
}

export default function Map({ latitud, longitud, mapHeight }: MapProps) {

  const icon = L.icon({
    iconUrl: "/marker-icon.png?height=25&width=25",
    iconSize: [25, 35],
    iconAnchor: [12,20],
    popupAnchor: [1, -34],
  })

  useEffect(() => {
    console.log(latitud)
    console.log(longitud)
  }
  , [latitud, longitud])  


  return (
    /*
      Añadí `className="relative z-0"` al div exterior para establecer un contexto de apilamiento.
      Agregué `className="relative z-10"` al componente `Card` para asegurar que esté por encima de otros elementos dentro del mismo contexto de apilamiento, pero aún por debajo de la alerta.
      Mantuve `className="z-0"` en el `MapContainer` para asegurar que esté en la base del contexto de apilamiento del Card.
      Desactivé el control de zoom del mapa (`zoomControl={false}`) para evitar posibles problemas de z-index con los controles del mapa.

    */
    <>
     { latitud && longitud &&(
        <div className="w-full relative z-0"> 
          <Card className="relative z-10">
            <CardContent className="p-0">
              <div style={{ height: `${mapHeight}px`, width: '100%' }}>
                <MapContainer 
                  center={[latitud, longitud]} 
                  zoom={13} 
                  style={{ height: '100%', width: '100%' }}
                  zoomControl={false} 
                  className="z-0" 
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={[latitud, longitud]} icon={icon}/>
                </MapContainer>
              </div>
            </CardContent>
          </Card>
       </div>
     )}
    </>
    
  )
}
