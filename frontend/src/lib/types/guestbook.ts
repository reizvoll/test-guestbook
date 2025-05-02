export type Guestbook = {
  id: number;
  contents: string;
  user_id: number;
  user_nickname: string;
  created_at: string;
  likes?: number;
}