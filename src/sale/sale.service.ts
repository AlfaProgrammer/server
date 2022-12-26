import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ISale, SaleDocument } from "src/mongoose-schemas/sales.schema";
import { SaleDTO } from "src/validation-types/DTOs/dtos";

// import { ProductSchema } from "src/mongoose-schemas/product.schema"; //to check the quantity availability
import { ProductService } from "src/product/product.service";

@Injectable()
export class SaleService{
    constructor(
        @InjectModel("Sale") private saleModel: Model<SaleDocument>,
        private productService: ProductService
    ){}

    async createSale(saleData: SaleDTO): Promise<ISale>{
                
        const product = await this.productService.getProductById(saleData.product); //recupero prodotto dal ref id 
        
        //Verifica che non superi la quantità a magazzino 
        if(product.warehouseStockQuantity < saleData.quantity){
            throw new Error("Sale quantity is greater than it's wareHouse availability");
        }else{
            const productId=saleData.product;
            const fieldToUpdate="warehouseStockQuantity";
            const newQuantity=product.warehouseStockQuantity - saleData.quantity;

            //prima di salvare la SALE la quantità a magazzino del prodotto deve essere diminuita 
            try {
                await this.productService.updateProductField(productId, fieldToUpdate, newQuantity);                
            } catch (error) {
                //if the Product warehouseStockQUantity isn't updatet, we must throw an ERROR
                throw new Error(`The attempt to update Product wareHouseField failed,
                error message: ${error}`);                
            }

            const sale = new this.saleModel(saleData); //creo nuova sale
            return sale.save();
        }        

    }


}