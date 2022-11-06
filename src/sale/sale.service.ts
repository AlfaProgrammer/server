import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { SaleSchema } from "src/mongoose-schemas/sales.schema";
import { SaleDTO } from "src/validation-types/DTOs/dtos";

@Injectable()
export class SaleService{
    constructor(@InjectModel("Sale") private saleModel: Model<typeof SaleSchema>){}

    async createSale(saleData: SaleDTO): Promise<typeof SaleSchema>{
        //pre create middleware
        
        const sale = await this.saleModel.create(saleData)
        return sale.save()
    }
}