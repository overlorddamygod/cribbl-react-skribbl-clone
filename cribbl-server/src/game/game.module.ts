import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';

@Module({
  imports: [],
  controllers: [GameController],
  providers: [GameGateway, GameService],
})
export class GameModule {}
