import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '..';
// import { }

export enum Screen {
  lobby,
  game
}


type Player = {
  id: string;
  username: string;
  points?: number;
  rank? : number;
};

type GameState = {
  screen: Screen;
  rounds: number;
  drawTime: number;
  customWords: string;
  players: Player[];
  messages: {
    type: string;
    message: string;
  }[],
  creator: string;
};

const initialState: GameState = {
  screen: Screen.lobby,
  rounds: 3,
  drawTime: 80,
  customWords: "",
  players: [],
  messages: [],
  creator: ""
}

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    clear_game_state: (state) => {
      state.screen = Screen.lobby
      state.rounds = 3
      state.drawTime = 80
      state.customWords = ""
      state.players = []
      state.messages = []
      state.creator = ""
    },
    set_initial: (state, action) => {
      const { screen, rounds, drawTime, customWords, players, creator } = action.payload;
      state.screen = screen;
      state.rounds = rounds;
      state.drawTime = drawTime;
      state.customWords = customWords;
      state.players = players;
      state.creator = creator;
      // state.value -= 1
    },
    set_rounds: (state, action) => {
      state.rounds =  +action.payload;
    },
    set_drawTime: (state, action) => {
      state.drawTime =  +action.payload;
    },
    set_customWords: (state, action) => {
      state.customWords =  action.payload;
    },
    set_creator: (state, action) => {
      state.creator =  action.payload;
    },
    add_player: (state, action) => {
      state.players.push(action.payload);
    },
    remove_player: (state, action) => {
      state.players = state.players.filter(p => p.id != action.payload)
    },
    set_players: (state, action) => {
      state.players = action.payload
    },
    showLobby: (state) => {
      state.screen = Screen.lobby;
    },
    showGame: (state) => {
      state.screen = Screen.game;
    },
    add_message: (state, action) => {
      state.messages.push(action.payload) 
    }
  },
})

// Action creators are generated for each case reducer function
export const { clear_game_state, set_initial,add_message, set_creator, set_rounds, set_drawTime, set_customWords, set_players, add_player, remove_player,showLobby, showGame } = gameSlice.actions

export const selectGameState = (state: RootState) => state.game

export default gameSlice.reducer;
