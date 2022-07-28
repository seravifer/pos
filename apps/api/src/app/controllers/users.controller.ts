import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
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
  creae(@Body() data: any) {
    return this.dbService.user.create({ data });
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.dbService.user.findUnique({ where: { id } });
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.dbService.user.update({
      where: { id },
      data,
    });
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.dbService.user.delete({
      where: { id },
    });
  }
}
