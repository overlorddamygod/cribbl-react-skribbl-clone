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
  guessed?: boolean;
};

export type GameState = {
  screen: Screen;
  rounds: number;
  round: number;
  drawTime: number;
  customWords: string;
  players: Player[];
  messages: {
    _type: string;
    message: string;
    username: string;
  }[],
  creator: string;
  turn: Player;
  word: string;
  timeRemaining: number;
  startEnd: {
    start: number;
    end: number;
  }
};

const initialState: GameState = {
  screen: Screen.lobby,
  rounds: 3,
  round:1,
  drawTime: 80,
  customWords: "",
  players: [],
  messages: [],
  creator: "",
  turn: {
    id: "1",
    username: "LOL"
  } as Player,
  word: "",
  timeRemaining: 0,
  startEnd: {
    start: 0,
    end: 0
  }
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
      const { screen, rounds, drawTime, customWords, players, creator, round, turn, word, startEnd} = action.payload;
      state.screen = screen;
      state.rounds = rounds;
      state.drawTime = drawTime;
      state.customWords = customWords;
      state.players = players;
      state.creator = creator;
      state.round = round;
      state.turn = turn;
      state.word = word;
      state.startEnd = startEnd;
      // state.value -= 1
    },
    set_rounds: (state, action) => {
      state.rounds =  +action.payload;
    },
    set_startEnd: (state, action) => {
      state.startEnd = action.payload;
    },
    set_round: (state, action) => {
      state.round =  +action.payload;
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
    set_turn: (state, action) => {
      state.turn =  action.payload;
    },
    set_word: (state, action) => {
      state.word =  action.payload;
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
export const { clear_game_state, set_startEnd,set_round,set_word,set_initial,set_turn, add_message, set_creator, set_rounds, set_drawTime, set_customWords, set_players, add_player, remove_player,showLobby, showGame } = gameSlice.actions

export const selectGameState = (state: RootState) => state.game

export default gameSlice.reducer;