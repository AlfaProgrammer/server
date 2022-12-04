import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { SaleSchema } from "src/mongoose-schemas/sales.schema";
import { SaleDTO } from "src/validation-types/DTOs/dtos";

// import { ProductSchema } from "src/mongoose-schemas/product.schema"; //to check the quantity availability
// import { ProductService } from "src/product/product.service";

@Injectable()
export class SaleService{
    constructor(
        @InjectModel("Sale") private saleModel: Model<typeof SaleSchema>,
    ){}

    async createSale(saleData: SaleDTO): Promise<typeof SaleSchema>{
       
        const sale = new this.saleModel(saleData);
         
        return sale.save()
    }
}