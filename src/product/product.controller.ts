import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query, UsePipes } from '@nestjs/common';
import { ProductDTO, UpdateProductFieldDTO } from 'src/validation-types/DTOs/dtos';
import { productJoiSchema, updateProductFieldJoiSchema } from 'src/validation-types/joi-validation-schemas';
import { JoiValidationPipe } from 'src/validation.pipe';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
    constructor(private productService: ProductService){}

    @Post("create")
    @UsePipes(new JoiValidationPipe(productJoiSchema))
    async createProduct(@Body() product: ProductDTO){
        try {
            const newProduct = await this.productService.createProduct(product);
            return newProduct;
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                message: error.message,
            }, HttpStatus.BAD_REQUEST)
        }
    }

    @Get("all")
    async getAllProducts(){
        return await this.productService.getAllProducts();
    }

    //get product by it's name
    @Get()
    async getProductByName(@Query() query){
        if(!query.name){
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                message: `The query string has to be as follow: name:<productName you are looking for>`
            }, HttpStatus.BAD_REQUEST)
        }
        return await this.productService.getProductByName(query.name)
    }

    @Get(":id")
    async getProductById(@Param("id") id: string) {
        try {
            const product = await this.productService.getProductById(id);            
            return product;
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                message: error.message? error.message : `Something went wrong trying retrieve a product by id "${id}" `
            }, HttpStatus.BAD_REQUEST)
        }
    }

    @Put("edit")
    @UsePipes(new JoiValidationPipe(updateProductFieldJoiSchema))
    async updateProduct(@Query() payload: UpdateProductFieldDTO){
    ////////////////////////////if you want to update a nested field, you must specify a parent field inside of witch the "fieldToUpdate" lives //////////////////////
    //////////////////////////////////////////obviosly this parameter has to be bassed to te function throw the payload too //////////////////////////////////////////
        try {
            const product = await this.productService.updateProductField(payload);        
            return product;
        } catch (error) {
            //"forbidden_field"? HttpStatus.FORBIDDEN: HttpStatus.BAD_REQUEST
            //volendo si pu?? fare una cosa del genere delle riga sopra, ma penso che entrabi gli errori siano delle BAD_REQUEST
            throw new HttpException({
                status:HttpStatus.BAD_REQUEST,
                message: error.message
            },HttpStatus.BAD_REQUEST)
        }
    }

    @Delete(":id")
    async deleteById(@Param("id") id: string) {
        try {           
          return this.productService.deleteProduct(id);
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                message: error.message? error.message : "Something went wrong trying to deleteproduct (delete product route)"
            }, HttpStatus.BAD_REQUEST)
        }
    }
}
