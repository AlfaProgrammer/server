import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ProductSchema } from "src/mongoose-schemas/product.schema";
import { ProductDTO } from "src/validation-types/DTOs/dtos";

@Injectable()
export class ProductService{
    constructor(@InjectModel("Product") private productModel: Model<typeof ProductSchema>){}

    createProduct(newProduct: ProductDTO): Promise<typeof ProductSchema>{
        return this.productModel.create(newProduct);
    }

    getProduct(name){
        return this.productModel.where("name").equals(name);
    }
}