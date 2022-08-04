import { forwardRef, Inject } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server, Socket } from 'socket.io';
import { PrismaService } from 'src/prisma.service';
import { GameService } from './game.service';

@WebSocketGateway({ cors: true })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @Inject(forwardRef(() => GameService))
    private readonly gameService: GameService,
  ) {}
  handleDisconnect(client: any) {
    console.log('disconnected');
    this.gameService.removePlayer(client.id);
    // client.leave(id);
  }

  handleConnection(client: any, ...args: any[]) {
    console.log('CONNECTED', client.id);
  }

  @WebSocketServer()
  public server: Server;

  @SubscribeMessage('events')
  findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
    return from([1, 2, 3]).pipe(
      map((item) => ({ event: 'events', data: item })),
    );
  }
  @SubscribeMessage('message')
  message(@MessageBody() data: any): any {
    console.log('SAD', data);
    return data;
  }

  @SubscribeMessage('game:join')
  join(@ConnectedSocket() client: Socket, @MessageBody() data: any): any {
    const { id, user_id, username } = data;
    this.gameService.joinGame(id, client, {
      id: client.id,
      username,
      user_id
    });
    return data;
  }
  @SubscribeMessage('game:disconnect')
  disconnect(@ConnectedSocket() client: Socket): any {
    console.log('HEREEEE MANNNNNN');
    this.gameService.removePlayer(client.id);
  }

  @SubscribeMessage('game:set:rounds')
  setRounds(@ConnectedSocket() client: Socket, @MessageBody() data: any): any {
    const { id, rounds } = data;
    this.gameService.setRounds(id, +rounds);
  }
  @SubscribeMessage('game:set:drawTime')
  setDrawTime(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): any {
    const { id, drawTime } = data;
    this.gameService.setDrawTime(id, +drawTime);
  }
  @SubscribeMessage('game:set:customWords')
  setCustomWords(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): any {
    const { id, customWords } = data;
    this.gameService.setCustomWords(id, customWords);
  }

  @SubscribeMessage('game:start')
  showLobby(@ConnectedSocket() client: Socket, @MessageBody() data: any): any {
    const { id } = data;
    this.gameService.startGame(id);
  }

  @SubscribeMessage('game:drawing')
  drawing(@ConnectedSocket() client: Socket, @MessageBody() data: any): any {
    const gameId = data.pop();
    // client.broadcast.emot
    // client.broadcast.emit('lol');
    this.gameService.drawing(gameId, client, data);
  }
  @SubscribeMessage('game:fill')
  fill(@ConnectedSocket() client: Socket, @MessageBody() data: any): any {
    const gameId = data.pop();
    // client.broadcast.emot
    // client.broadcast.emit('lol');
    this.gameService.fill(gameId, client, data);
  }
  @SubscribeMessage('game:clear')
  clearCanvas(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): any {
    this.gameService.clearCanvas(data);
  }

  @SubscribeMessage('game:sendMessage')
  sendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): any {
    const { gameId, profile, message } = data;
    this.gameService.sendMessage(gameId, client.id, profile, message);
  }

  @SubscribeMessage('game:setWord')
  setWord(@ConnectedSocket() client: Socket, @MessageBody() data: any): any {
    const { gameId, word } = data;
    this.gameService.setWord(gameId, client, word);
  }

  @SubscribeMessage('game:kickPlayer')
  kickPlayer(@ConnectedSocket() client: Socket, @MessageBody() data: any): any {
    const { gameId, playerId, toBeKickedId } = data;
    this.gameService.kickPlayer(gameId, playerId, toBeKickedId);
  }
}
