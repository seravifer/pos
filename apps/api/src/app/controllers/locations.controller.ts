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

@Controller('locations')
export class LocationsController {
  constructor(private readonly dbService: DBService) {}

  @Get()
  get() {
    return this.dbService.location.findMany();
  }

  @Post()
  create(@Body() data: any) {
    return this.dbService.location.create({ data });
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.dbService.location.findUnique({ where: { id } });
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.dbService.location.update({
      where: { id },
      data,
    });
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.dbService.location.delete({
      where: { id },
    });
  }
}
