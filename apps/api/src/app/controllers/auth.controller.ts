import { Body, Controller, Get, Post, UnauthorizedException } from '@nestjs/common';
import { DBService } from '../services/db.service';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { ILogin, ILoginUser } from '@pos/models';

@Controller('auth')
export class AuthController {
  constructor(private readonly dbService: DBService, private jwtService: JwtService) {}

  @Get('users')
  get(): Promise<ILoginUser[]> {
    return this.dbService.user.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }

  @Post()
  async login(@Body() data: { id: string; pin: string }): Promise<ILogin> {
    const user = await this.dbService.user.findUnique({
      where: { id: data.id },
    });
    const isValid = await compare(data.pin, user.hash);
    if (user && isValid) {
      return {
        user,
        token: this.jwtService.sign({ id: user.id }),
      };
    }
    throw new UnauthorizedException();
  }
}
