import { Link } from "react-router-dom";
import styles from "./CityItem.module.css";
import { useCities } from "../contexts/CitiesContext";
import { type City } from "../lib/types";

interface CityItemProps {
   city: City
}

const formatDate = (date: Date) =>
   new Intl.DateTimeFormat("en", {
      day: "numeric",
      month: "long",
      year: "numeric",
   }).format(new Date(date));

export default function CityItem({ city }: CityItemProps) {
   const { currentCity, deleteCity } = useCities();
   const { cityName, emoji, date, id, position } = city;

   function handleClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
      e.preventDefault();
      deleteCity(id!);
   }

   return (
      <li>
         <Link
            to={`${id}?lat=${position.lat}&lng=${position.lng}`}
            className={`${styles.cityItem} ${id === currentCity.id ? styles["cityItem--active"] : ""}`}
         >
            <span className={styles.emoji}>{emoji}</span>
            <h3 className={styles.name}>{cityName}</h3>
            <time className={styles.date}>({formatDate(date)})</time>
            <button className={styles.deleteBtn} onClick={handleClick}>
               &times;
            </button>
         </Link>
      </li>
   );
}
