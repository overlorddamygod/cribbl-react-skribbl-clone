import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameModule } from './game/game.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    GameModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
