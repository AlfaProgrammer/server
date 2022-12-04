import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IProduct, ProductDocument} from "src/mongoose-schemas/product.schema";
// import { ProductDocument, ProductSchema } from "src/mongoose-schemas/product.schema";
import { ProductDTO } from "src/validation-types/DTOs/dtos";

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
        //con la dependency injection il primo passaggeio, dove creo il model basato sullo shcema viene fatto in automatico
    */
    createProduct(newProduct: ProductDTO): Promise<IProduct>{
        const createdProduct = new this.productModel(newProduct);
        return createdProduct.save()
    }
    async getProductByName(productName){
        return await this.productModel.where("name").equals(productName)
    }

    async getProductById(productId){
        return await this.productModel.findById(productId).exec();
    }
}