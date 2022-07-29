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

@Controller('categories')
export class CategoriesController {
  constructor(private readonly dbService: DBService) {}

  @Get()
  get() {
    return this.dbService.category.findMany();
  }

  @Post()
  create(@Body() data: any) {
    return this.dbService.category.create({ data });
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.dbService.category.findUnique({ where: { id } });
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.dbService.category.update({
      where: { id },
      data,
    });
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.dbService.category.delete({
      where: { id },
    });
  }
}
