import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ISale, SaleDocument } from "src/mongoose-schemas/sales.schema";
import { SaleDTO, UpdateProductFieldDTO, UpdateSaleFieldDTO } from "src/validation-types/DTOs/dtos";

// import { ProductSchema } from "src/mongoose-schemas/product.schema"; //to check the quantity availability
import { ProductService } from "src/product/product.service";
import { updateSaleError } from "src/custom_errors/crudErrors";

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

    async findAll(): Promise<ISale[]>{
        return this.saleModel.find();
    }
    async findAllByIsEstimate(isEstimate: string): Promise<ISale[]>{
        if(isEstimate === "true" || isEstimate === "false"){
            return this.saleModel.find({isEstimate: isEstimate}) //ES6 key:value format here is being used
        }else{
            throw new Error(`You are trying to use "isEstimate" parameter with a value that is nor true or false. If you want to retrieve all sales
                        try by deleteng isEstimate query param`)
        }
    }
    async updateSaleField(options: UpdateSaleFieldDTO): Promise<ISale>{
        /**
         * until now isEstimate parameter has to remain unchangeble, we need to decite first what to do with the estimat in case of changing thi param
         */

        //destructuring the "options" argument, if a specific param does not exist it's value will be null
        let {
            saleId,
            fieldToUpdate,
            newValue,
            // parentField
        } = options || null;
        
        if (fieldToUpdate === "_id") {
            throw new updateSaleError("You are not allowed to modify _id field on any entity into the database")
        }

        if(fieldToUpdate === "isEstimate"){
            throw new updateSaleError(`until new developments of the project, the parameter "isEstimate" is decided to remain immutable`)
        }
        /*//if parentField is set, means I wanto to update a nested field. So, I need to modify the fieldToUpdate this way
        //to access a nested field parentField.nestedField returns nestedFiedl value
    THE SALE DOCUMENT DOES NOT CONTAIN NESTED OBJECTS. THIS IS WHY WE DON'NEED A PARENT FIELD PARAMETER. HOWEVER, IF IT WILL BE NEEDED IN THE FUTURE
    YOU CAN USE THIS CODE SHOWN BELOW, LIKE PRODUCT UPDATE IS USING IT. REMEBER TO UPDATE JOI.SCHEMA AND UpdataeProductDTO as well with the parentField parameter
        if(parentField){
            fieldToUpdate = `${parentField}.${fieldToUpdate}`
        } */

        const productChanged = await this.saleModel.findByIdAndUpdate(saleId, {[fieldToUpdate]: newValue}, {
            runValidators: true, //to run validators iven when we are updating (by default validators does not take place on updates)
            upsert: false, //to prevent adding new field
            new: true, //to return the modified doc rather than the original
        })
        return productChanged;
    }

    async getSaleById(salaId: string): Promise<ISale>{
        return this.saleModel.findById(salaId);
    }
}