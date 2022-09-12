import { Module } from '@nestjs/common';
import { ProductsController } from './controllers/products.controller';
import { DBService } from './services/db.service';
import { CategoriesController } from './controllers/categories.controller';
import { BillsController } from './controllers/bills.controller';
import { UsersController } from './controllers/users.controller';
import { TablesController } from './controllers/tables.controller';
import { LocationsController } from './controllers/locations.controller';
import { BillProductsController } from './controllers/bill-products.controller';
import { MenusController } from './controllers/menu.controller';
import { SectionsController } from './controllers/sections.controller';

@Module({
  imports: [],
  controllers: [
    ProductsController,
    CategoriesController,
    BillsController,
    UsersController,
    TablesController,
    LocationsController,
    BillProductsController,
    MenusController,
    SectionsController,
  ],
  providers: [DBService],
})
export class AppModule {}
