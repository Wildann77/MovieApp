import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { devtools, persist } from "zustand/middleware";
import createSelectors from "./selector";

// Slice auth
const createAuthSlice = (set) => ({
  accessToken: null,
  user: null,

  setAuth: (token, user) =>
    set({
      accessToken: token,
      user,
    }),

  setAccessToken: (token) => set({ accessToken: token }),
  clearAccessToken: () =>
    set({
      accessToken: null,
      user: null,
    }),
});

export const useStoreBase = create()(
  devtools(
    persist(
      immer((...a) => ({
        ...createAuthSlice(...a),
      })),
      {
        name: "session-storage",
        getStorage: () => sessionStorage,
      }
    )
  )
);

export const useStore = createSelectors(useStoreBase);
