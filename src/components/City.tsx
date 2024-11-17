import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCities } from "../contexts/CitiesContext";
import Spinner from "./Spinner";
import styles from "./City.module.css";
import BackButton from "./BackButton";

const formatDate = (date: null | Date) =>
   date
      ? new Intl.DateTimeFormat("en", {
           day: "numeric",
           month: "long",
           year: "numeric",
           weekday: "long",
        }).format(new Date(date))
      : "Jan 1, 1970";

export default function City() {
   // get data from URL. id потому что чекай App.tsx
   const { id } = useParams<{ id: string }>();
   const { getCity, currentCity, isLoading } = useCities();

   useEffect(() => {
      if (id) getCity(id);
   }, [id, getCity]);

   const { cityName, emoji, date, notes } = currentCity;

   if (isLoading) return <Spinner />;

   return (
      <div className={styles.city}>
         <div className={styles.row}>
            <h6>City name</h6>
            <h3>
               <span>{emoji}</span> {cityName}
            </h3>
         </div>

         <div className={styles.row}>
            <h6>You went to {cityName} on</h6>
            <p>{formatDate(date || null)}</p>
         </div>

         {notes && (
            <div className={styles.row}>
               <h6>Your notes</h6>
               <p>{notes}</p>
            </div>
         )}

         <div className={styles.row}>
            <h6>Learn more</h6>
            <a href={`https://en.wikipedia.org/wiki/${cityName}`} target="_blank" rel="noreferrer">
               Check out {cityName} on Wikipedia &rarr;
            </a>
         </div>

         <div>
            <BackButton />
         </div>
      </div>
   );
}
