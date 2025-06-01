import { create } from 'zustand';
import apiRequest from './apiRequest';

export const NotificationStore = create((set, get) => ({
  number: 0,

  fetch: async () => {
    try {
      const res = await apiRequest("/users/notification");
      if (typeof res.data === 'number') {
        set({ number: res.data });
      } else {
        console.warn("Unexpected response format for notifications:", res.data);
        set({ number: 0 });
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      set({ number: 0 });
    }
  },

  decrease: () => {
    const current = get().number;
    set({ number: Math.max(0, current - 1) }); // Ensure it doesn't go negative
  },

  reset: () => {
    set({ number: 0 });
  },
}));
