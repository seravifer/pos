import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { INewUser } from '@pos/models';
import { DBService } from '../services/db.service';
import { hash } from 'bcrypt';
import { AuthGuard } from '../guards/auth.guard';

const SALT_ROUNDS = 10;

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly dbService: DBService) {}

  @Get()
  get() {
    return this.dbService.user.findMany({
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  @Post()
  async create(@Body() data: INewUser) {
    const hashed = await hash(data.pin, SALT_ROUNDS);
    const user = {
      name: data.name,
      hash: hashed,
    };
    return this.dbService.user.create({ data: user });
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.dbService.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: INewUser) {
    const hashed = await hash(data.pin, SALT_ROUNDS);
    const user = {
      name: data.name,
      hash: hashed,
    };
    return this.dbService.user.update({
      where: { id },
      data: user,
    });
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.dbService.user.delete({
      where: { id },
    });
  }
}
