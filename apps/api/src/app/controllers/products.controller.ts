import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { DBService } from '../services/db.service';

@Controller('products')
@UseGuards(AuthGuard)
export class ProductsController {
  constructor(private readonly dbService: DBService) {}

  @Get()
  get() {
    return this.dbService.product.findMany();
  }

  @Post()
  create(@Body() data: any) {
    return this.dbService.product.create({ data });
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.dbService.product.findUnique({ where: { id } });
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    const { createdAt, updateAt, ...rest } = data;
    return this.dbService.product.update({
      where: { id },
      data: rest,
    });
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.dbService.product.delete({
      where: { id },
    });
  }
}
