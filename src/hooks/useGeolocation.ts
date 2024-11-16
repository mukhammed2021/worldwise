import { useState } from "react";

type Position = {
   lat: number;
   lng: number;
};
type Error = string;

export function useGeolocation(defaultPosition = null) {
   const [isLoading, setIsLoading] = useState(false);
   const [position, setPosition] = useState<Position | null>(defaultPosition);
   const [error, setError] = useState<Error | null>(null);

   function getPosition() {
      if (!navigator.geolocation) return setError("Your browser does not support geolocation");

      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
         (pos) => {
            setPosition({
               lat: pos.coords.latitude,
               lng: pos.coords.longitude,
            });
            setIsLoading(false);
         },
         (error) => {
            setError(error.message);
            setIsLoading(false);
         }
      );
   }

   return { isLoading, position, error, getPosition };
}
