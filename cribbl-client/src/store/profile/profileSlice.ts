import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '..';

export type Profile = {
  id: string;
  username: string;
  server: string;
};

const initialState: Profile = {
  id: "",
  username: "",
  server: "",
}

export const profileSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    set_id: (state, action) => {
        state.id = action.payload;
    },
    set_username: (state, action) => {
        state.username = action.payload;
        localStorage.setItem("username", state.username);
    },
    set_server: (state, action) => {
        state.server = action.payload;
    }
  },
})

export const { set_id, set_username, set_server } = profileSlice.actions

export const selectGameState = (state: RootState) => state.game

export default profileSlice.reducer;