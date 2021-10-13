import { configureStore } from "@reduxjs/toolkit";
import profileReducer from "./profile/profileSlice";
import gameReducer from "./game/gameSlice";

export const store = configureStore({
    reducer: {
        profile: profileReducer,
        game: gameReducer
    }
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
