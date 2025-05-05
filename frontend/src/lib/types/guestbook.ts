export type Guestbook = {
  id: number;
  contents: string;
  user_id: number;
  user_nickname: string;
  created_at: string;
  updated_at: string;
  likes: number;
  liked_by_user: boolean;
}