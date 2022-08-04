import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { UserService } from './user.service';
import { User as UserModel } from '@prisma/client';
import { hashSync, compareSync } from 'bcrypt';
import { sign } from "jsonwebtoken"
import { AuthGuard } from './auth.guard';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UserService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/auth/signup')
  async signupUser(
    @Body() userData: { username: string; password: string },
  ): Promise<UserModel> {
    userData.username = userData.username.trim();

    if ( userData.username.length < 3 || userData.username.length > 20) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Username must be between 3 and 20 characters',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if ( userData.password.length < 8 || userData.password.length > 20) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Password must be between 8 and 20 characters',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.userService.getUserByUsername(userData.username);

    if (user) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: 'User with that username already exists',
        },
        HttpStatus.CONFLICT,
      );
    }

    userData.password = hashSync(userData.password, 10);

    const res = this.userService.createUser(userData);
    return res;
  }

  @Post('/auth/signin')
  async signinUser(
    @Body() userData: { username: string; password: string },
  ): Promise<{
    id: number;
    username: string;
    access_token: string;
  }> {
    const user = await this.userService.getUserByUsername(userData.username);

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'User doesnot exist',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    if (!compareSync(userData.password, user.password)) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'Incorrect password',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const accessToken = sign({
      id: user.id,
      username: user.username,
    }, process.env.TOKEN_SECRET, { expiresIn: '86400s' });
  
    return {
      id: user.id,
      username: user.username,
      access_token: accessToken
    };
  }
}
