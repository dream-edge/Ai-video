export interface Participant {
  id: string;
  name: string;
  video_title: string;
  instagram_post_id: string;
  instagram_post_url: string;
  thumbnail_url?: string | null;
  likes: number;
  created_at: string;
  updated_at: string;
}

export interface Settings {
  theme: string;
  description: string;
  target_date: string;
}

export type NewParticipant = Omit<Participant, 'id' | 'created_at' | 'updated_at'>;
export type UpdateParticipant = Partial<Omit<Participant, 'id' | 'created_at' | 'updated_at'>>;

export interface Guideline {
  id: number;
  content: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}
