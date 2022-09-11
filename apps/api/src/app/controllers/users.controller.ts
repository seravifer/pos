import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { DBService } from '../db.service';

@Controller('users')
export class UsersController {
  constructor(private readonly dbService: DBService) {}

  @Get()
  get() {
    return this.dbService.user.findMany();
  }

  @Post()
  create(@Body() data: any) {
    return this.dbService.user.create({ data });
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.dbService.user.findUnique({ where: { id } });
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.dbService.user.update({
      where: { id },
      data,
    });
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.dbService.user.delete({
      where: { id },
    });
  }
}
