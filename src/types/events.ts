export interface Country {
  id: number;
  name: string;
}

export interface City {
  id: number;
  name: string;
  country: Country;
}

export interface Zone {
  id: number;
  name: string;
  city: City;
}

export interface Event {
  id: string;
  type: string;
  date: string;
  zone: Zone;
  booked: number;
  capacity: number;
  status: string;
}
