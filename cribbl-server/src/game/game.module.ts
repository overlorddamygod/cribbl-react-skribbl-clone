import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { GameController } from './game.controller';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';

@Module({
  imports: [],
  controllers: [GameController],
  providers: [PrismaService, GameGateway, GameService],
})
export class GameModule {}
