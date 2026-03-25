// Garden domain types

export type PlotStatus = 'seed' | 'sprout' | 'growing' | 'blooming' | 'withered';
export type Mood = 'sunny' | 'cloudy' | 'stormy' | 'rainy';

export interface User {
  id: number;
  username: string;
  email: string;
  avatar_url: string | null;
  created_at: string;
}

export interface Plant {
  id: number;
  name: string;
  description: string;
  growth_days: number;
  image_key: string | null;
  created_at: string;
}

export interface GardenPlot {
  id: number;
  user_id: number;
  slot_index: number;
  plant_id: number | null;
  plant: Plant | null;
  planted_at: string | null;
  watered_at: string | null;
  status: PlotStatus | null;
  created_at: string;
  updated_at: string;
}

export interface JournalEntry {
  id: number;
  user_id: number;
  content: string;
  mood: Mood;
  created_at: string;
}

export interface CommunityGift {
  id: number;
  sender_id: number;
  receiver_id: number;
  plant_id: number | null;
  message: string | null;
  sent_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
