import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { SaleSchema } from "src/mongoose-schemas/sales.schema";
import { SaleDTO } from "src/validation-types/DTOs/dtos";

// import { ProductSchema } from "src/mongoose-schemas/product.schema"; //to check the quantity availability
import { ProductService } from "src/product/product.service";

@Injectable()
export class SaleService{
    constructor(
        @InjectModel("Sale") private saleModel: Model<typeof SaleSchema>,
        private productService: ProductService
    ){}

    async createSale(saleData: SaleDTO): Promise<typeof SaleSchema>{
        
        const sale = new this.saleModel(saleData); //creo nuova sale
        
        const product = await this.productService.productByIdClosure(saleData.product); //recupero prodotto dal ref id 
        
        //Verifica che non superi la quantità a magazzino 
        if(product.getProdQuantity() < saleData.quantity){
            throw new Error("Sale quantity is greater than it's wareHouse availability");
        }else{
            //prima di salvare la SALE la quantità a magazzino deve essere diminuita 
            await product.decreeseQuantity(saleData.quantity);
            return sale.save();
        }        

    }


}