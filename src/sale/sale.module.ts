import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SaleSchema } from 'src/mongoose-schemas/sales.schema';
import { SaleController } from './sale.controller';
import { SaleService } from './sale.service';

@Module({
    imports: [MongooseModule.forFeature([{name: "Sale", schema: SaleSchema}])],
    controllers:[SaleController],
    providers:[SaleService]
})
export class SaleModule {}
