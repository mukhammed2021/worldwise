import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { useCities } from "../contexts/CitiesContext";
import { useGeolocation } from "../hooks/useGeolocation";
import { useUrlPosition } from "../hooks/useUrlPosition";
import styles from "./Map.module.css";
import Button from "./Button";

export default function Map() {
   const { cities } = useCities();
   const [mapPosition, setMapPosition] = useState<[number, number]>([40, 0]);
   const { isLoading: isLoadingPosition, position: geolocationPosition, getPosition } = useGeolocation();
   const [mapLat, mapLng] = useUrlPosition();

   // синхронизация mapLat, mapLng с mapPosition
   useEffect(() => {
      if (mapLat && mapLng) setMapPosition([Number(mapLat), Number(mapLng)]);
   }, [mapLat, mapLng]);

   useEffect(() => {
      if (geolocationPosition) setMapPosition([geolocationPosition.lat, geolocationPosition.lng]);
   }, [geolocationPosition]);

   return (
      <div className={styles.mapContainer}>
         {!geolocationPosition && (
            <Button type="position" onClick={getPosition}>
               {isLoadingPosition ? "Loading..." : "Use your position"}
            </Button>
         )}
         <MapContainer center={mapPosition} zoom={6} scrollWheelZoom={true} className={styles.map}>
            <TileLayer
               attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
               url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
            />
            {cities.map((city) => (
               <Marker key={city.id} position={[Number(city.position.lat), Number(city.position.lng)]}>
                  <Popup>
                     <span>{city.emoji}</span> <span>{city.cityName}</span>
                  </Popup>
               </Marker>
            ))}

            <ChangeCenter position={mapPosition} />
            <DetectClick />
         </MapContainer>
      </div>
   );
}

interface ChangeCenterProps {
   position: [number, number];
}

function ChangeCenter({ position }: ChangeCenterProps) {
   const map = useMap();
   map.setView(position);
   return null;
}

function DetectClick() {
   const navigate = useNavigate();

   useMapEvents({
      click: (e) => {
         navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
      },
   });

   return null;
}
