import { type Country } from "../lib/types";
import styles from "./CountryItem.module.css";

interface CountryItemProps {
   country: Country;
}

export default function CountryItem({ country }: CountryItemProps) {
   return (
      <li className={styles.countryItem}>
         <span>{country.emoji}</span>
         <span>{country.country}</span>
      </li>
   );
}
