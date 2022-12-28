import { Body, Controller, Get, HttpException, HttpStatus, Post, UsePipes } from "@nestjs/common";
import { SaleDTO } from "src/validation-types/DTOs/dtos";
import { saleJoiSchema } from "src/validation-types/joi-validation-schemas";
import { JoiValidationPipe } from "src/validation.pipe";
import { SaleService } from "./sale.service";

@Controller("sales")
export class SaleController{
    constructor(private saleService: SaleService){}

    @Post("create")
    @UsePipes(new JoiValidationPipe(saleJoiSchema))
    async createSale(@Body() paylaod: SaleDTO){
        try {
            //IF incoming paylaod has "fromCatalog" property set on true, we create a sale, otherwise we create an Estimate
            if(paylaod.fromCatalog){
                const sale = await this.saleService.createSale(paylaod);
                return sale;                
            } else {
                const sale = await this.saleService.createEstimate(paylaod);
                return sale;
            }

        } catch (error) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                message: error.message
            }, HttpStatus.BAD_REQUEST)
        }
    }

    async deleteSale(){}

    async updateSale(){}

    async getAllSales(){}

    async getSaleById(){}

    
    //We need to retrieve the product to compare its warehouseStockQuantity 
    //with the quantity of the incoming sale to check availability and over quantity attempt
}