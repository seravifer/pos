import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { DBService } from '../services/db.service';
import { compare } from 'bcrypt';

@Controller('auth')
export class AuthController {
  constructor(private readonly dbService: DBService) {}

  @Post()
  async authenticate(@Body() data: { id: string; pin: string }) {
    const user = await this.dbService.user.findUnique({
      where: { id: data.id },
    });
    const isValid = await compare(data.pin, user.hash);
    if (user && isValid) {
      return user;
    }
    throw new UnauthorizedException();
  }
}
