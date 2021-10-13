import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '..';

type Profile = {
  id: string;
  username: string;
};

const initialState: Profile = {
  id: "",
  username: ""
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
    }
  },
})

export const { set_id, set_username } = profileSlice.actions

export const selectGameState = (state: RootState) => state.game

export default profileSlice.reducer;