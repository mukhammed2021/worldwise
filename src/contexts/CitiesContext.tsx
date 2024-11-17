import { createContext, useCallback, useContext, useEffect, useReducer } from "react";
import { type City } from "../lib/types";

interface CitiesProviderProps {
   children: React.ReactNode;
}

interface CitiesContextType {
   cities: City[];
   isLoading: boolean;
   currentCity: City;
   error: string;
   getCity: (id: string) => void;
   createCity: (newCity: City) => void;
   deleteCity: (id: string) => void;
}

const BASE_URL = "http://localhost:8000";

const CitiesContext = createContext<CitiesContextType | null>(null);

const initialState = {
   cities: [] as City[],
   isLoading: false,
   currentCity: {} as City,
   error: "",
};

type ACTIONTYPE =
   | { type: "loading" }
   | { type: "cities/loaded"; payload: City[] }
   | { type: "city/loaded"; payload: City }
   | { type: "city/created"; payload: City }
   | { type: "city/deleted"; payload: string }
   | { type: "rejected"; payload: string };

function reducer(state: typeof initialState, action: ACTIONTYPE): typeof initialState {
   switch (action.type) {
      case "loading":
         return { ...state, isLoading: true };

      case "cities/loaded":
         return {
            ...state,
            isLoading: false,
            cities: action.payload,
         };

      case "city/loaded":
         return {
            ...state,
            isLoading: false,
            currentCity: action.payload,
         };

      case "city/created":
         return {
            ...state,
            isLoading: false,
            cities: [...state.cities, action.payload],
            currentCity: action.payload,
         };

      case "city/deleted":
         return {
            ...state,
            isLoading: false,
            cities: state.cities.filter((city) => city.id !== action.payload),
            currentCity: {} as City,
         };

      case "rejected":
         return {
            ...state,
            isLoading: false,
            error: action.payload,
         };

      default:
         throw new Error("Unknown action type");
   }
}

function CitiesProvider({ children }: CitiesProviderProps) {
   const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(reducer, initialState);

   useEffect(() => {
      async function fetchCities() {
         dispatch({ type: "loading" });

         try {
            const res = await fetch(`${BASE_URL}/cities`);
            const data = await res.json();
            dispatch({ type: "cities/loaded", payload: data });
         } catch {
            dispatch({ type: "rejected", payload: "There was an error loading cities..." });
         }
      }
      fetchCities();
   }, []);

   const getCity = useCallback(
      async function getCity(id: string) {
         if (currentCity && "id" in currentCity && id === currentCity.id) return;

         dispatch({ type: "loading" });

         try {
            const res = await fetch(`${BASE_URL}/cities/${id}`);
            const data = await res.json();
            dispatch({ type: "city/loaded", payload: data });
         } catch {
            dispatch({ type: "rejected", payload: "There was an error loading the city..." });
         }
      },
      [currentCity.id]
   );

   async function createCity(newCity: City) {
      dispatch({ type: "loading" });

      try {
         // keep the remote state
         const res = await fetch(`${BASE_URL}/cities`, {
            method: "POST",
            body: JSON.stringify(newCity),
            headers: {
               "Content-Type": "application/json",
            },
         });
         const data = await res.json();

         // in sync with UI state
         dispatch({ type: "city/created", payload: data });
      } catch {
         dispatch({ type: "rejected", payload: "There was an error creating the city..." });
      }
   }

   async function deleteCity(id: string) {
      dispatch({ type: "loading" });

      try {
         await fetch(`${BASE_URL}/cities/${id}`, {
            method: "DELETE",
         });

         dispatch({ type: "city/deleted", payload: id });
      } catch {
         dispatch({ type: "rejected", payload: "There was an error deleting the city..." });
      }
   }

   return (
      <CitiesContext.Provider
         value={{
            cities,
            isLoading,
            currentCity,
            error,
            getCity,
            createCity,
            deleteCity,
         }}
      >
         {children}
      </CitiesContext.Provider>
   );
}

function useCities() {
   const context = useContext(CitiesContext);
   if (!context) throw new Error("useCities has to be used within <CitiesContext.Provider>");
   return context;
}

export { CitiesProvider, useCities };
