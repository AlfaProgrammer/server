import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SaleSchema } from 'src/mongoose-schemas/sales.schema';
import { SaleController } from './sale.controller';
import { SaleService } from './sale.service';

// import { ProductSchema } from 'src/mongoose-schemas/product.schema';
import { ProductModule } from 'src/product/product.module';

@Module({
    imports: [
        MongooseModule.forFeature([{name: "Sale", schema: SaleSchema}]),
        ProductModule
    ],
    controllers:[SaleController],
    providers:[SaleService]
})
export class SaleModule {}
