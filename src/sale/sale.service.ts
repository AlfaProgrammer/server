import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ISale, SaleDocument } from "src/mongoose-schemas/sales.schema";
import { SaleDTO, UpdateProductFieldDTO } from "src/validation-types/DTOs/dtos";

// import { ProductSchema } from "src/mongoose-schemas/product.schema"; //to check the quantity availability
import { ProductService } from "src/product/product.service";

@Injectable()
export class SaleService{
    constructor(
        @InjectModel("Sale") private saleModel: Model<SaleDocument>,
        private productService: ProductService
    ){}

/*SALE AND ESTIMATE ARE THE SAME THING, IT CHANGES A FEW PARAMETERS BETWEEN THEM, BUT ARE CREATING ON TOP OF THE SAME MONGOOSE SCHEMA*/
    async createSale(saleData: SaleDTO): Promise<ISale>{
        //We need to retrieve the product by its id only when we are creating a sale from catalog,
        //otherwise it means we are creating an estimate
        
        const product = await this.productService.getProductById(saleData.product); //retrieving product by ref id
        /*After getting the product we must set SALE NAME the same as the product name  and also check the quantity on the product
        warehouseStockQuantity availability*/
        
        //Checking the product warehouseStockAvailability 
        if(product.warehouseStockQuantity < saleData.quantity){
            throw new Error("Sale quantity is greater than it's wareHouse availability");
        }else{
            //I create an options object to pass to the updateProductField function. This function manipulates the 
            //product field specified in that same options object
            const updateQuantityOptions: UpdateProductFieldDTO = {
                productId: saleData.product,
                fieldToUpdate: "warehouseStockQuantity",
                newValue: product.warehouseStockQuantity - saleData.quantity
            }

            //prima di salvare la SALE la quantità a magazzino del prodotto deve essere diminuita 
            try {
                await this.productService.updateProductField(updateQuantityOptions);
            } catch (error) {
                //if the Product warehouseStockQUantity isn't updatet, we must throw an ERROR
                throw new Error(`The attempt to update Product wareHouseField failed,
                error message: ${error}`);                
            }            
            
            //now I need to set the SALE NAME and create the sale
            console.log(product.name)
            saleData.name = product.name; 
            const sale = new this.saleModel(saleData); //creo nuova sale
            return sale.save();
        
        }
    }

    async createEstimate(saleData: SaleDTO): Promise<ISale>{
        const sale = new this.saleModel(saleData);
        return sale.save();
    }
}