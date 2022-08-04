import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth.guard';
import { GameService } from './game.service';

@UseGuards(AuthGuard)
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

  @Get('/find')
  getRandomGame() {
    return this.gameService.getRandomGame();
  }
  @Get('/')
  getAllGames() {
    return this.gameService.getAllGames();
  }
}
