import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { DBService } from '../services/db.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly dbService: DBService) {}

  @Get()
  get() {
    return this.dbService.category.findMany();
  }

  @Get('/products')
  getAll() {
    return this.dbService.category.findMany({
      include: {
        products: true,
      },
    });
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.dbService.category.findUnique({ where: { id } });
  }

  @Post()
  create(@Body() data: any) {
    return this.dbService.category.create({ data });
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.dbService.category.update({
      where: { id },
      data,
    });
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.dbService.category.delete({
      where: { id },
    });
  }
}
