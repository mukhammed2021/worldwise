import { useSearchParams } from "react-router-dom";

export function useUrlPosition() {
   // get lat, lng from URL
   const [searchParams] = useSearchParams();
   const lat = searchParams.get("lat");
   const lng = searchParams.get("lng");

   return [lat, lng];
}
