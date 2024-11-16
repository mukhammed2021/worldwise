import Map from "../components/Map";
import Sidebar from "../components/Sidebar";
import styles from "./AppLayout.module.css";
import User from "../components/User";

export default function AppLayout() {
   return (
      <div className={styles.app}>
         <Sidebar />
         <Map />
         <User />
      </div>
   );
}
