export type UserState = {
  isLoggedIn: boolean;
  user: {
    id: number;
    nickname: string;
  } | null;
  setUser: (user: { id: number; nickname: string } | null) => void;
}