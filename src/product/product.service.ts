import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { updateProductError } from "src/custom_errors/crudErrors";
import { IProduct, ProductDocument} from "src/mongoose-schemas/product.schema";
// import { ProductDocument, ProductSchema } from "src/mongoose-schemas/product.schema";
import { ProductDTO, UpdateProductFieldDTO } from "src/validation-types/DTOs/dtos";

@Injectable()
export class ProductService{
    constructor(@InjectModel("Product") private productModel: Model<ProductDocument>){}
    //Iniettando il model stai creando la sturttura della collection basata su uno schema specifico
    //tutti i recorda della collection Poducts dovranno essere bassati su quel Modello.
    //quando vuoi inserire un nuovo record, esso deve essere una nuova istanza basata su quel model, non lo schema
    /*
        guarda bene questo workflow
        const ProductModel = mongoose.model("Product", ProductSchema)
        per creare poi un nuovo prodotto da inserire dentro questa collection 
        const newProduct = new ProductModel(data)
        con la dependency injection il primo passaggeio, dove creo il model basato sullo schema viene fatto in automatico
        dentro il constructor della classe
    */
    async createProduct(newProduct: ProductDTO): Promise<IProduct>{
        const createdProduct = new this.productModel(newProduct);
        return createdProduct.save()
    }

    async getAllProducts(): Promise<IProduct[]>{
        return this.productModel.find()
    }
    async getProductByName(productName: string): Promise<IProduct[]>{ //the return statement should be an array o products
        return this.productModel.where("name").equals(productName)
    }

    async updateProductField(options: UpdateProductFieldDTO): Promise<IProduct>{
        //destructuring the "options" argument, if a specific param does not exist it's value will be null
        let {
            productId,
            fieldToUpdate,
            newValue,
            parentField
        } = options || null;
        
        if (fieldToUpdate === "_id") {
            throw new updateProductError("You are not allowed to modify _id field on any entity into the database")
        }

        //if parentField is set, means I wanto to update a nested field. So, I need to modify the fieldToUpdate this way
        //to access a nested field parentField.nestedField returns nestedFiedl value
        if(parentField){
            fieldToUpdate = `${parentField}.${fieldToUpdate}`
        }

        const productChanged = await this.productModel.findByIdAndUpdate(productId, {[fieldToUpdate]: newValue}, {
            runValidators: true, //to run validators iven when we are updating (by default validators does not take place)
            upsert: false, //to prevent adding new field
            new: true, //to return the modified doc rather than the original
        })
        return productChanged;
    }

    async deleteProduct(productId){
        return await this.productModel.deleteOne({"_id": productId});
    }
    //creo una funzione che mi recupera un prodotto in base all'id
    async getProductById(productId: string){
        try {
            const product: IProduct = await this.productModel.findById(productId);    
            return product;
        } catch (error) {
            throw new Error(`Something went wrong trying to retrieve product by ID ${productId}`);            
        }

    }

    // async deleteOne(productId){
    //     return this.productModel.deleteOne({"_id": productId})
    // }

    // async getProductById(productId): Promise<IProduct>{
    //     return this.productModel.findById(productId).exec();
    // }
}