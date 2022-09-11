import { Module } from '@nestjs/common';
import { ProductsController } from './controllers/products.controller';
import { DBService } from './db.service';
import { CategoriesController } from './controllers/categories.controller';
import { BillsController } from './controllers/bills.controller';
import { UsersController } from './controllers/users.controller';
import { TablesController } from './controllers/tables.controller';
import { LocationsController } from './controllers/locations.controller';
import { BillProductsController } from './controllers/bill-products.controller';

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
  ],
  providers: [DBService],
})
export class AppModule {}
