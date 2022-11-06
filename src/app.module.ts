import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

//Modules Imports
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { ContactModule } from './contat/contact.module';
import { ProductModule } from './product/product.module';
import { SaleModule } from './sale/sale.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async(config: ConfigService)=>({uri: config.get("DATABASE_URL")}),
    }),
    UserModule,
    ContactModule,
    ProductModule,
    SaleModule
  ],
})
export class AppModule {}
