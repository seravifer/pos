import { Module } from '@nestjs/common';
import { ProductsController } from './controllers/products.controller';
import { DBService } from './services/db.service';
import { CategoriesController } from './controllers/categories.controller';
import { BillsController } from './controllers/bills.controller';
import { UsersController } from './controllers/users.controller';
import { TablesController } from './controllers/tables.controller';
import { LocationsController } from './controllers/locations.controller';
import { BillItemsController } from './controllers/bill-items.controller';
import { MenusController } from './controllers/menu.controller';
import { SectionsController } from './controllers/sections.controller';
import { AuthController } from './controllers/auth.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({ secret: process.env.JWT_SECRET ?? 'secret' })],
  controllers: [
    ProductsController,
    CategoriesController,
    BillsController,
    UsersController,
    TablesController,
    LocationsController,
    BillItemsController,
    MenusController,
    SectionsController,
    AuthController,
  ],
  providers: [DBService],
})
export class AppModule {}
