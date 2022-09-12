import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Menu } from '@pos/models';
import { DBService } from '../services/db.service';

@Controller('menus')
export class MenusController {
  constructor(private readonly dbService: DBService) {}

  @Get()
  get() {
    return this.dbService.menu.findMany();
  }

  @Post()
  create(@Body() data: Menu) {
    return this.dbService.menu.create({ data });
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.dbService.menu.findUnique({ where: { id } });
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Menu) {
    return this.dbService.menu.update({
      where: { id },
      data,
    });
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.dbService.menu.delete({
      where: { id },
    });
  }
}
