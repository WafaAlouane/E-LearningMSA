export interface Joke {
  id: number;
  type: string;
  setup: string;
  punchline: string;
}

export interface Quote {
  q: string;
  a: string;
  h: string;
}

export interface Activity {
  activity: string;
  accessibility: number;
  type: string;
  participants: number;
  price: number;
  link: string;
  key: string;
}