import { Server, Socket } from 'socket.io';
import words from "./words";

type Player = {
  id: string;
  username: string;
  points?: number;
  rank?: number;
  guessed?: boolean;
};

type Message = {
  username: string;
  _type: string;
  message: string;
};

enum Screen {
  lobby,
  game,
}

class Game {
  io: Server;
  public roomId: string;
  creator: string;
  players: Player[];
  turnOf: Player;
  rounds: number;
  roundDone: number;
  drawTime: number;
  turnIndex: number;
  customWords: string[];
  correctWord: string;
  time: NodeJS.Timeout;
  hint: string;
  screen: Screen;
  startEnd: {
    start: number;
    end: number;
  };
  wordSelectionTimeOut: NodeJS.Timeout;

  constructor(io: Server, roomId: string) {
    this.io = io;
    this.roomId = roomId;
    this.rounds = 3;
    this.drawTime = 80;
    this.customWords = [];
    this.creator = '';

    this.roundDone = 0;
    this.turnIndex = 0;
    this.correctWord = '';
    this.hint = '';
    this.time = null;
    this.turnOf = {
      id: '1',
      username: '3',
    };
    // this.creator = creator;
    // this.timeLimit = TimeLimit
    // this.totalRounds = 3
    this.players = [];
    this.screen = Screen.lobby;
    this.startEnd = {
      start: 0,
      end: 0,
    };
    this.log(`Game Created`);
    console.log(this.getDetails());
  }

  message(profile: Player, msg: string) {
    const playerId = profile.id;
    const guessedOrIsTurn =
      this.playerAlreadyGuessed(playerId) || this.isPlayersTurn(playerId);
    const message = {
      message: msg,
      _type: 'normal',
      username: profile.username,
    } as Message;
    if (!guessedOrIsTurn) {
      if (message.message == this.correctWord) {
        // Send word guessed
        // console.log("CORRECT");
        message._type = 'correct';
        message.message = `${profile.username} guessed the word.`;
        this.players = this.players.map((player) => {
          if (!(player.id == playerId)) return player;
          return {
            ...player,
            points: player.points! + 25,
            guessed: true,
          };
        });

        const unguessed = this.players.filter((player) => {
          return (
            player.id != this.getTurnPlayer().id && player.guessed == false
          );
        });
        console.log('UNGUESSED', unguessed);

        if (unguessed.length == 0) {
          this.log('Everyone Guessed the word');
          clearTimeout(this.time);
          this.showScoreBoard();
        }
      } else {
        message._type = 'normal';
        console.log('WRONG');
      }
    } else {
      message._type = 'normal';
    }

    // this.io.sockets.in(this.roomId).emit('message', message);
    this.log(`${message._type} ${message.message}`);
    this.emit('game:message', message);
  }

  getDetails() {
    return {
      id: this.roomId,
      rounds: this.rounds,
      drawTime: this.drawTime,
      customWords: this.customWords,
      players: this.players,
      creator: this.creator,
      screen: this.screen,
      round: this.roundDone + 1,
      turn: this.getTurnPlayer() || {
        id: '1',
        username: '3',
      },
      word: this.hint,
      startEnd: this.startEnd,
    };
  }

  addPlayer(player: Player, client: Socket, broadcast = true) {
    client.join(this.roomId);
    this.log(`Player joined ${player.username} (${player.id})`);

    player.guessed = false;
    player.points = 0;
    player.rank = 1;
    if (this.players.length == 0) {
      this.setCreator(player.id);
    }
    // console.log(player);
    this.players.push(player);
    if (broadcast) {
      client.broadcast.in(this.roomId).emit('game:joined', player);
      client.emit('game:state', this.getDetails());
    }
    // console.log(`${player.username} joined roomId : ${this.roomId}`);
  }

  setCreator(id: string) {
    this.creator = id;
    this.emit('game:creator', this.creator);
  }

  removePlayer(playerId: string) {
    const playerIndex = this.players.findIndex(
      (player) => player.id == playerId,
    );
    if (playerIndex < 0) return;
    const player = this.players[playerIndex];

    this.players = this.players.filter((player) => player.id != playerId);

    if (player.id == this.creator) {
      if (this.players.length > 0) {
        console.log('SET CREATOR');
        this.setCreator(this.players[0].id);
      }
    }

    if (this.turnOf) {
      if (player.id == this.turnOf.id && this.players.length > 0) {
        this.handleTurnEnd();
      }
    }

    if (playerIndex < this.turnIndex) {
      this.turnIndex = Math.max(0, this.turnIndex - 1);
    }

    this.log(`${player.username} closed the game`);
    // this.io.in(this.roomId).emit()
    this.io.in(this.roomId).emit('game:disconnected', player);
    return this.players.length == 0;
  }

  getCustomWords() {
    return [1,2,3].map(word=>words[Math.floor(Math.random() * words.length)].toLowerCase());
  }

  setRounds(rounds: number) {
    this.rounds = rounds;
    this.emit('game:rounds', rounds);
  }
  setDrawTime(drawTime: number) {
    this.drawTime = drawTime;
    this.emit('game:drawTime', drawTime);
  }
  setCustomWords(customWords: string[]) {
    this.customWords = customWords;
    this.emit('game:customWords', customWords);
  }

  emit(event: string, data: any) {
    this.io.in(this.roomId).emit(event, data);
    // this.io.
  }
  // console.log(`${player.username} joined roomId : ${this.roomId}`);

  // this.removePlayer = (playerId) => {
  //     this.players = this.players.filter(player=>player.id != playerId)
  //     console.log(`${playerId} removed from roomId : ${this.roomId}`);
  // }

  drawing(data: any[], client: Socket) {
    client.broadcast.in(this.roomId).emit('game:draw', data);
  }
  fill(data: any[], client: Socket) {
    this.log(`Fill canvas ${data}`);
    client.broadcast.in(this.roomId).emit('game:fill', data);
  }

  clearCanvas() {
    this.log('Clear Canvas');
    this.emit('game:clear', '');
  }

  log(message: string) {
    console.log(` Game [${this.roomId}]: ${message}`);
  }

  startGame() {
    if (this.players.length < 2) {
      this.log('Not enough players');
      return;
    }
    this.log(`Game Started`);
    // this.changeTurn()
    this.screen = Screen.game;
    this.roundDone = 0;
    this.emit('game:started', '');
    setTimeout(() => {
      this.startRound();
    }, 1000);
  }

  startRound() {
    this.log(`${this.roundDone + 1} started`);
    this.turnIndex = this.players.length - 1;
    this.emit('game:round', this.roundDone + 1);
    this.clearCanvas();
    setTimeout(() => {
      this.changeTurn();
    }, 2000);
  }

  changeTurn() {
    this.clearCanvas();
    const turnOf = this.players[this.turnIndex];
    this.turnOf = turnOf;
    this.log(`${turnOf.username}'s turn to choose word`);
    this.customWords = this.getCustomWords();
    this.io.to(turnOf.id).emit("game:setCustomWords", this.customWords);
    this.emit('game:turn', turnOf);
    // wait for some seconds for player to choose word

    this.wordSelectionTimeOut = setTimeout(this.setRandomWordFromServer.bind(this), 10000);
    // this.setWord("LOL")
  }

  getTimeStamp(seconds = 1) {
    const now = new Date();
    const nowTimeStamp = now.getTime();
    return {
      start: nowTimeStamp,
      end: nowTimeStamp + seconds * 1000,
    };
  }

  setCorrectWord(word, cb) {
    this.correctWord = word;
    this.log(`${word} selected`);
    this.hint = this.correctWord
      .split('')
      .map((w) => '_')
      .join('');
    cb();
    this.startTurn();
  }

  setRandomWordFromServer() {
    if ( this.correctWord ) return;
    const randomWord = this.customWords[Math.floor(Math.random() * this.customWords.length)].toLowerCase()
    this.setCorrectWord(randomWord, () => {
      this.io.in(this.roomId).to(this.turnOf.id).emit('game:word', this.correctWord);
      this.io.in(this.roomId).except(this.turnOf.id).emit('game:word', this.hint);
    });
  }

  setWordFromPlayer(client: Socket, word: string) {
    if (client.id == this.getTurnPlayer().id) {
      this.startTurn();
      this.setCorrectWord(word, () => {
        client.broadcast.in(this.roomId).emit('game:word', this.hint);
        client.emit('game:word', this.correctWord);
      });
      clearTimeout(this.wordSelectionTimeOut);
    } else {
      this.log('Not authorized - setWord');
    }
  }

  startTurn() {
    this.log('Start guessing......');
    this.startEnd = this.getTimeStamp(this.drawTime);
    this.emit('game:startTime', this.startEnd);
    this.time = setTimeout(() => {
      this.showScoreBoard();
    }, this.drawTime * 1000);
  }

  showScoreBoard() {
    console.log(this.players);
    this.players = this.players.map((player) => ({
      ...player,
      guessed: false,
    }));
    this.log('show');
    this.emit('game:showScoreboard', {
      word: this.correctWord,
      players: this.players,
    });
    this.correctWord = '';
    this.handleTurnEnd();
  }

  handleTurnEnd() {
    setTimeout(() => {
      if (this.players.length == 0) return;
      this.emit('game:hideScoreboard', '');
      this.log('hide');

      this.turnIndex--;
      if (this.turnIndex < 0) {
        // Round over
        this.roundDone++;
        if (this.roundDone == this.rounds) {
          // All round over
          this.log('GAME FINISHED');
          setTimeout(() => {
            this.emit('game:allRoundsFinished', '');
          }, 2000);
        } else {
          // Start next round
          this.startRound();
        }
      } else {
        // Round still remaining;
        this.changeTurn();
      }
    }, 2000);
  }

  getTurnPlayer() {
    if (this.turnIndex > this.players.length - 1 && this.turnIndex < 0) {
      this.log('Player doesnot exist');
      return;
    }
    return this.turnOf;
  }

  playerAlreadyGuessed(playerId: string) {
    const player = this.players.find((player) => player.id == playerId);
    if (player) {
      if (player.guessed) return true;
    } else {
      this.log(`Player(${playerId}) doesn't exist`);
    }
    return false;
  }

  isPlayersTurn(id: string) {
    const p = this.getTurnPlayer();
    if (p) {
      return p.id == id;
    }
    return false;
  }

  isCreator(id: string) {
    return this.creator == id;
  }

  voteKick(playerId: string, toBeKickedId: string) {
    // increase votes
    // check if votes are majority
    // kick the player
    // change turn
  }

  kickPlayer(playerId, toBeKickedId) {
    if (playerId != this.creator) {
      this.log('Not authorized - kickPlayer');
    }
    this.log(`${playerId} kicked ${toBeKickedId}`);
    this.io.to(toBeKickedId).emit('game:kicked', '');
    // this.emit('game:kick', toBeKickedId);
    return this.removePlayer(toBeKickedId);
  }
}

export default Game;
export { Player };
