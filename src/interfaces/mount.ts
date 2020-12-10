export interface Station {
  mount: string;
  genre: string;
  description: string;
  now_playing: string;
  name: string;
}

export interface ServerStatus {
  [key: string]: Station;
}


export interface Song {
  album: string;
  id: string;
  title: string;
  artist: string;
  genre: string;
  path: string;
}

export interface NewStationForm {
  stationName: string;
    query: string | null;
    genre: string;
    mount: string;
    description: string;
}
