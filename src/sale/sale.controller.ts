import { Body, Controller, HttpException, HttpStatus, Post, UsePipes } from "@nestjs/common";
import { saleJoiSchema } from "src/validation-types/joi-validation-schemas";
import { JoiValidationPipe } from "src/validation.pipe";
import { SaleService } from "./sale.service";

@Controller("sales")
export class SaleController{
    constructor(private saleService: SaleService){}

    @Post("create")
    @UsePipes(new JoiValidationPipe(saleJoiSchema))
    async allSales(@Body() data){
        try {
            const sale = await this.saleService.createSale(data);
            return sale
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.BAD_GATEWAY,
                message: error.message
            }, HttpStatus.BAD_REQUEST)
        }
    }
}