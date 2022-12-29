import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Put, Query, UsePipes } from "@nestjs/common";
import { SaleDTO, UpdateSaleFieldDTO } from "src/validation-types/DTOs/dtos";
import { saleJoiSchema, updateSaleFieldJoiSchema } from "src/validation-types/joi-validation-schemas";
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

    //if isEstimat param is provided, I need to filter sales by that parameter. This is why I'm using an optional query parameter argument 
    @Get("all")
    async getAllSales(@Query("isEstimate") isEstimate?: string){ //boolean string
        try {
            if(isEstimate){
                return this.saleService.findAllByIsEstimate(isEstimate);
            }
            return await this.saleService.findAll();
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                message: error.message
            }, HttpStatus.BAD_REQUEST)
        }
    }

    @Put("edit")
    @UsePipes(new JoiValidationPipe(updateSaleFieldJoiSchema))
    async updateSale(@Query() payload: UpdateSaleFieldDTO){
        try {
            const sale = await this.saleService.updateSaleField(payload);        
            return sale;
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                message: error.name? `ErrorName: ${error.name}, ErrorMessage: ${error.message}` : error.message
            }, HttpStatus.BAD_REQUEST)
        }
    }

    @Get(":id") //localhost/sales/id
    async getSaletById(@Param("id") id: string) {
        try {
            const sale = await this.saleService.getSaleById(id);            
            return sale;
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                message: error.message? error.message : `Something went wrong trying retrieve a sale by id "${id}" `
            }, HttpStatus.BAD_REQUEST)
        }
    }

    async deleteSale(){}

    
    //We need to retrieve the product to compare its warehouseStockQuantity 
    //with the quantity of the incoming sale to check availability and over quantity attempt
}