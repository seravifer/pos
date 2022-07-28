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

  @Post()
  creae(@Body() data: any) {
    return this.dbService.product.create({ data });
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.dbService.product.findUnique({ where: { id } });
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.dbService.product.update({
      where: { id },
      data,
    });
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.dbService.product.delete({
      where: { id },
    });
  }
}
