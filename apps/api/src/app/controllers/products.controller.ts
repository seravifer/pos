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

@Controller('products')
export class ProductsController {
  constructor(private readonly dbService: DBService) {}

  @Get()
  get() {
    return this.dbService.product.findMany();
  }

  @Get('/all')
  getAll() {
    return this.dbService.category.findMany({
      include: {
        products: true,
      },
    });
  }

  @Post()
  create(@Body() data: any) {
    return this.dbService.product.create({ data });
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.dbService.product.findUnique({ where: { id } });
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    const { createdAt, updateAt, ...rest } = data;
    return this.dbService.product.update({
      where: { id },
      data: rest,
    });
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.dbService.product.delete({
      where: { id },
    });
  }
}
