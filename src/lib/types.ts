export interface Country {
   country: string;
   emoji: string;
}

export interface City {
   id?: string;
   cityName: string;
   country: string;
   emoji: string;
   date: Date;
   notes: string;
   position: {
      lat: string | null;
      lng: string | null;
   };
}