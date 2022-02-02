import { Injectable, Logger } from '@nestjs/common';
import Game from './game.class';
import { GameGateway } from './game.gateway';
import { Player } from './game.class';
import { Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class GameService {
  private games: {
    [key: string]: Game;
  } = {};
  private readonly logger = new Logger(GameService.name);

  private playerToGameId: { [key: string]: string } = {};

  constructor(private readonly gameGateway: GameGateway) {}

  createGame() {
    const gameId = uuidv4();
    const game = new Game(this.gameGateway.server, gameId);

    this.games[gameId] = game;
    return {
      gameId,
    };
  }

  getRandomGame() {
    const gameIds = Object.keys(this.games);
    const chosenGameId = gameIds[Math.floor(Math.random() * gameIds.length)];

    if (gameIds.length > 0) {
      return {
        gameId: chosenGameId,
      };
    }
    return {
      gameId: '',
    };
  }

  getAllGames(): any {
    return Object.values(this.games).map((game) => game.getDetails());
  }

  joinGame(
    gameId: string,
    client: Socket,
    player: { id: string; username: string },
  ) {
    const game = this.getGame(gameId);
    if (game) {
      game.addPlayer(player, client);
      this.playerToGameId[player.id] = gameId;
    } else {
      console.error('NO game');
      client.emit('game:404');
    }
  }

  removePlayer(playerId: string) {
    const game = this.playerToGame(playerId);

    if (game) {
      const deleteGame = game.removePlayer(playerId);
      // if (deleteGame) {
      //   delete this.games[game.roomId];
      //   axios.get('http://localhost:8000/api/game/delete?gameId=' + game.roomId);
      // }
      delete this.playerToGameId[playerId];
    } else {
      console.error('No game');
    }
  }

  kickPlayer(gameId, playerId: string, toBeKickedId: string) {
    const game = this.getGame(gameId);

    if (game) {
      const deleteGame = game.kickPlayer(playerId, toBeKickedId);
      // if (deleteGame) {
      //   delete this.games[game.roomId];
      // }
      delete this.playerToGameId[playerId];
    } else {
      console.error('No game');
    }
  }

  drawing(gameId: any, client: Socket, data: any) {
    const game = this.getGame(gameId);

    if (game) {
      game.drawing(data, client);
    } else {
      console.error('No game');
      client.emit('game:404');
    }
  }
  fill(gameId: any, client: Socket, data: any) {
    const game = this.getGame(gameId);

    if (game) {
      game.fill(data, client);
    } else {
      console.error('No game');
      client.emit('game:404');
    }
  }
  clearCanvas(gameId: string) {
    const game = this.getGame(gameId);

    if (game) {
      game.clearCanvas();
    } else {
      console.error('No game');
    }
  }

  getGameDetails(gameId: string): any {
    if (!this.gameExists(gameId)) {
      return;
    }
    const game = this.games[gameId];
    return game.getDetails();
  }

  sendMessage(gameId: string, id: string, profile: Player, message: string) {
    const game = this.getGame(gameId);

    if (game) {
      game.message(profile, message);
    }
  }
  setWord(gameId: string, client: Socket, word: string) {
    const game = this.getGame(gameId);

    if (game) {
      game.setWordFromPlayer(client, word);
    }
  }

  setRounds(id: string, rounds: number) {
    const game = this.getGame(id);

    if (game) {
      game.setRounds(rounds);
    }
  }
  setDrawTime(id: string, drawTime: number) {
    const game = this.getGame(id);

    if (game) {
      game.setDrawTime(drawTime);
    }
  }
  setCustomWords(id: string, customWords: string[]) {
    const game = this.getGame(id);

    if (game) {
      game.setCustomWords(customWords);
    }
  }

  startGame(id: string) {
    const game = this.getGame(id);
    if (game) {
      game.startGame();
    }
  }

  gameExists(id: string): boolean {
    return Object.keys(this.games).includes(id);
  }

  getGame(id: string): Game | null {
    if (!this.gameExists(id)) return null;
    return this.games[id];
  }

  playerToGame(playerId: string): Game | null {
    if (playerId in this.playerToGameId)
      return this.getGame(this.playerToGameId[playerId]);
    return null;
  }

  @Cron('45 * * * * *')
  handleGameCleanUps() {
    const gameIds = Object.keys(this.games);
    this.logger.log(`CLEANING UP: ${gameIds.length} games available`);
    gameIds.forEach((gameId) => {
      const game = this.games[gameId];
      if (game.isFinished()) {
        delete this.games[gameId];
        this.logger.log(`Cleaning Game #${gameId}`);
        axios.get('http://localhost:8000/api/game/delete?gameId=' + gameId);
      }
    })
    this.logger.log(`AFTER CLEAN UP: ${Object.keys(this.games).length} games available`);
  }
}

function randomInt(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}
