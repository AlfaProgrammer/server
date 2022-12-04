import { Body, Controller, Get, HttpException, HttpStatus, Post, Query, UsePipes } from '@nestjs/common';
import { ProductDTO } from 'src/validation-types/DTOs/dtos';
import { productJoiSchema } from 'src/validation-types/joi-validation-schemas';
import { JoiValidationPipe } from 'src/validation.pipe';
import { ProductService } from './product.service';

@Controller('product')
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


    @Get()
    async getProductByName(@Query("name") name){
        return await this.productService.getProductByName(name)
    }
    // @Post("create")
    // prova(@Body() x){
    //     if(!x.surname)
    //     {
    //         throw new HttpException({
    //             status: "bellissimo",
    //             message: "Qui Messaggino di errore",
    //             secondMessage: "PROVA2"
    //         }, HttpStatus.BAD_REQUEST)
    //     }
    //     return x
    // }
}
