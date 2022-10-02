import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { DBService } from '../services/db.service';
import { ILocation } from '@pos/models';
import { AuthGuard } from '../guards/auth.guard';

@Controller('locations')
@UseGuards(AuthGuard)
export class LocationsController {
  constructor(private readonly dbService: DBService) {}

  @Get()
  get() {
    return this.dbService.location.findMany();
  }

  @Post()
  create(@Body() data: ILocation) {
    return this.dbService.location.create({ data });
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.dbService.location.findUnique({ where: { id } });
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: ILocation) {
    return this.dbService.location.upsert({
      where: { id },
      create: data,
      update: data,
    });
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.dbService.location.delete({
      where: { id },
    });
  }
}
