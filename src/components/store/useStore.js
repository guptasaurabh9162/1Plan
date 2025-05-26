import { create } from 'zustand';
import { badges } from '../data/badges';

export const useStore = create((set, get) => ({
  user: null,
  visitedPlaces: [],
  badges: [],
  points: 0,

  addVisit: (placeId, points) => {
    set((state) => ({
      visitedPlaces: [...state.visitedPlaces, placeId],
      points: state.points + points
    }));
    get().checkBadges();
  },

  checkBadges: () => {
    const state = get();
    const newBadges = badges.filter((badge) => {
      if (badge.requirement.type === 'points') {
        return state.points >= badge.requirement.value;
      }
      if (badge.requirement.type === 'visits') {
        return state.visitedPlaces.length >= badge.requirement.value;
      }
      return false;
    }).map((badge) => badge.id);

    set({ badges: [...new Set([...state.badges, ...newBadges])] });
  }
}));
