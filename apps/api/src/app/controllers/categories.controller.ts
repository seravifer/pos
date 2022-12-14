import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ICategory } from '@pos/models';
import { AuthGuard } from '../guards/auth.guard';
import { DBService } from '../services/db.service';

@Controller('categories')
@UseGuards(AuthGuard)
export class CategoriesController {
  constructor(private readonly dbService: DBService) {}

  @Get()
  get() {
    return this.dbService.category.findMany();
  }

  @Get('/products')
  getAll(): Promise<ICategory[]> {
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
