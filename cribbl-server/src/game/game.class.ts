import { Server, Socket } from 'socket.io';

type Player = {
  id: string;
  username: string;
  points?: number;
  rank?: number;
};

enum Screen {
  lobby,
  game,
}

class Game {
  //   roomId: string;
  io: Server;
  roomId: string;
  creator: string;
  players: Player[];
  rounds: number;
  drawTime: number;
  customWords: string;
  screen: Screen;

  constructor(io: Server, roomId: string) {
    this.io = io;
    this.roomId = roomId;
    this.rounds = 3;
    this.drawTime = 80;
    this.customWords = '';
    this.creator = '';

    // this.creator = creator;
    // this.timeLimit = TimeLimit
    // this.totalRounds = 3
    this.players = [];
    this.screen = Screen.lobby;
    this.log(`Game Created`);

    // this.correctWord = ''
    // this.turnOf = {}
    // this.time = ''
    // this.turnIndex = ''
    // this.roundDone = 1
    // this.roundMatch = 0
  }

  message(m: { id: string; message: string }) {
    this.emit('game:message', {
      id: m.id,
      message: m.message,
      type: 'normal',
    });
  }

  getDetails() {
    return {
      rounds: this.rounds,
      drawTime: this.drawTime,
      customWords: this.customWords,
      players: this.players,
      creator: this.creator,
      screen: this.screen,
    };
  }

  addPlayer(player: Player, client: Socket, broadcast = true) {
    client.join(this.roomId);
    this.log(`Player joined ${player.username} (${player.id})`);

    // player.guessed = false;
    player.points = 0;
    player.rank = 1;
    if (this.players.length == 0) {
      this.creator = player.id;
      this.emit('game:creator', this.creator);
    }
    // console.log(player);
    this.players.push(player);
    if (broadcast) {
      client.broadcast.in(this.roomId).emit('game:joined', player);
      client.emit('game:state', this.getDetails());
    }
    // console.log(`${player.username} joined roomId : ${this.roomId}`);
  }

  removePlayer(playerId: string) {
    // player.guessed = false;
    // player.points = 0;
    // console.log(player);
    this.players = this.players.filter((player) => player.id != playerId);

    this.log(`${playerId} closed the game`);
    this.io.in(this.roomId).emit('game:disconnected', playerId);
  }

  setRounds(rounds: number) {
    this.rounds = rounds;
    this.emit('game:rounds', rounds);
  }
  setDrawTime(drawTime: number) {
    this.drawTime = drawTime;
    this.emit('game:drawTime', drawTime);
  }
  setCustomWords(customWords: string) {
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

  startGame() {
    this.log(`Game Started`);
    // this.changeTurn()
    this.screen = Screen.game;
    this.emit('game:started', '');
  }

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

  // this.changeTurn = () => {
  //     if(!this.isRoundFinished()) {
  //         if(!this.turnIndex) {
  //             this.turnIndex = this.players.length-1
  //         } else {
  //             if(this.turnIndex <= 0) {
  //                 this.turnIndex = this.players.length-1
  //             } else {
  //                 this.turnIndex -=1
  //             }
  //         }

  //         const turnOf = this.players[this.turnIndex]
  //         console.log(`${turnOf.username}'s turn`);
  //         this.io.sockets.in(this.roomId).emit("start",turnOf)
  //     }

  //     // Send to the player whose turn is to send a word
  // }

  // this.isRoundFinished = () => {
  //     if (this.roundDone == this.totalRounds+1) {
  //         console.log("Match Finished")
  //         return true
  //     } else {
  //         return false
  //     }
  // }

  // this.startTurn = (word) => {
  //     this.correctWord = word
  //     this.time = setTimeout(() => {
  //         this.showScoreBoard()
  //     }, this.timeLimit);
  // }

  // this.showScoreBoard=()=> {
  //     console.log(this.players.filter(player=>player.guessed==true))

  //     // Send the scoreboard

  //     this.correctWord = ''
  //     this.io.sockets.in(this.roomId).emit('timeUp',this.players)
  //     this.io.sockets.in(this.roomId).emit('clearCanvas')
  //     this.players = this.players.map(player=> ({
  //         ...player,
  //         guessed:false
  //     }))

  //     this.handleRoundMatch()

  // }

  // this.handleRoundMatch = () => {
  //     if (!this.isRoundFinished()) {
  //         this.roundMatch++
  //         if(this.roundMatch==this.players.length) {
  //             this.roundDone++
  //             this.io.sockets.in(this.roomId).emit("rounds",this.roundDone)
  //             this.roundMatch = 0
  //         }
  //         this.changeTurn()
  //     }
  // }

  // this.guessWord = (playerId,message) => {
  //     const guessed = this.havePlayerAlreadyGuessed(playerId)
  //     if(!guessed) {
  //         if(message.m == this.correctWord) {
  //             // Send word guessed
  //             // console.log("CORRECT");
  //             message.type = 'correct'
  //             this.players = this.players.map(player => {
  //                 if (!(player.id == playerId)) return player
  //                 return {
  //                     ...player,
  //                     points:player.points+25,
  //                     guessed: true
  //                 }
  //             })

  //             if(this.players.filter(player=>player.guessed==true).length == this.players.length) {
  //                 console.log("Everyone Guessed the word")
  //                 clearTimeout(this.time)
  //                 this.showScoreBoard()
  //             }
  //         } else {
  //             console.log("WRONG")
  //         }
  //     } else {
  //         message.type = guessed
  //     }

  //     this.io.sockets.in(this.roomId).emit('message', message);

  // }

  // this.havePlayerAlreadyGuessed = (playerId) => {
  //     const { guessed } = this.players.filter(player => player.id == playerId )
  //     if (guessed) return true
  //     return false
  // }
}

// const gameRoom1 = new Game(1,1,{
//     id:1,
//     username:'overlord'
// },10000)

// const gameRoom2 = new Game(1,1,{
//     id:1,
//     username:'overlord'
// },15000)

// gameRoom1.addPlayer({
//     id:2,
//     username:'potato'
// })

// gameRoom2.addPlayer({
//     id:2,
//     username:'potato'
// })
// gameRoom2.addPlayer({
//     id:3,
//     username:'lol'
// })
// gameRoom1.startGame()
// gameRoom1.startTurn('hi')
// gameRoom1.guessWord(2,'hi')
// gameRoom1.guessWord(1,'hi')
// gameRoom1.startTurn('hey')
// gameRoom1.guessWord(2,'hey')
// gameRoom1.guessWord(1,'hey')
// gameRoom1.startTurn('h')
// gameRoom1.guessWord(2,'h')
// gameRoom1.guessWord(1,'h')
// gameRoom1.startTurn('hi')
// gameRoom1.guessWord(2,'hi')
// gameRoom1.guessWord(1,'hi')
// gameRoom1.startTurn('hey')
// gameRoom1.guessWord(2,'hey')
// gameRoom1.guessWord(1,'hey')
// gameRoom1.startTurn('h')
// gameRoom1.guessWord(2,'h')
// gameRoom1.guessWord(1,'h')

// gameRoom2.start()
// gameRoom2.startTurn('hi')
// gameRoom2.guessWord(1,'hello')
// gameRoom2.guessWord(1,'hi')

export default Game;
export { Player };
