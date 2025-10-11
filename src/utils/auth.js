import { create } from 'zustand';

export const getUser = async () => {
    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/me`, {
            method: 'GET',
            credentials: 'include'
        });
        if (!res.ok) throw new Error('Failed to fetch user by function');
        
        const data = await res.json();
        return data.user.login;
    } catch (err) {
        console.log('Error: ', err);
        return null;
    }
};

export const useUserStore = create((set) => ({
  user: null,

  fetchUser: async () => {
    const user = await getUser();
    set({ user });
  },
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
