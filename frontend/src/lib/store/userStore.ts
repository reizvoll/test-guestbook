import { create } from 'zustand';
import { UserState } from '../types/user';

export const userStore = create<UserState>((set) => ({
  isLoggedIn: false,
  user: null,
  setUser: (user) => set({ user, isLoggedIn: !!user }),
})); 