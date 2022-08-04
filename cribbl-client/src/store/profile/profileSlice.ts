import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '..';

export type Profile = {
  id: string;
  user_id: string;
  username: string;
  access_token: string;
};

const initialState: Profile = {
  id: "",
  user_id: "",
  username: "",
  access_token: "",
}

export const profileSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    set_id: (state, action) => {
        state.id = action.payload;
        localStorage.setItem("id", state.id);
    },
    set_userid: (state, action) => {
        state.id = action.payload;
        localStorage.setItem("user_id", state.id);
    },
    set_username: (state, action) => {
        state.username = action.payload;
        localStorage.setItem("username", state.username);
    },
    set_accessToken: (state, action) => {
        state.access_token = action.payload;
        localStorage.setItem("access_token", state.access_token);
    },
    set_profile: (state, action) => {
        state.user_id = action.payload.user_id;
        state.id = action.payload.id;
        state.username = action.payload.username;
        state.access_token = action.payload.access_token;
        localStorage.setItem("user_id", state.user_id);
        localStorage.setItem("id", state.id);
        localStorage.setItem("username", state.username);
        localStorage.setItem("access_token", state.access_token);
    }
  },
})

export const { set_id, set_username, set_accessToken, set_profile} = profileSlice.actions

export const selectGameState = (state: RootState) => state.game

export default profileSlice.reducer;