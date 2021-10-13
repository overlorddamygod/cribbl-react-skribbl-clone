import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}
  @Post('/create')
  create(@Body('username') username: string): any {
    console.log(`here ${username}}`);
    return this.gameService.createGame();
  }

  @Get('/details/:gameId')
  getDetails(@Param('gameId') gameId: string) {
    return this.gameService.getGameDetails(gameId);
  }

  @Get('/')
  getRandomGame() {
    return this.gameService.getRandomGame();
  }
}
