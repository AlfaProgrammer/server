import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Delete, Put, Query, UsePipes } from "@nestjs/common";
import { findAllByIsEstimateError } from "src/custom_errors/crudErrors";
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
    async getAllSales(@Query() query){ //boolean string
        /**
         * 3 USE CASES
         * first - Query parameter is set correctly. The sales corrisonding to the isEstimate param value are returned
         * second - Query parameter is set incorrectly, so i must notify this strange behaviour to the user (front-end dev)
         * third - Query parameter isn't set. All sales are returned.
         */
        // we need firsto to check if query object has keys ...
        if(Object.keys(query).length > 0){
            try {    
                if(query.isEstimate){ //if isEstimate key exist on query object, I have to parse the JSON, and pass the value to the service function
                    const isEstimateParsed = JSON.parse(query.isEstimate); //PARSE METHOD WILL THROW AN ERROR TOO IF SOMETHING GOES WRONG DURING PARSING OPERATION
                    
                    // we must verify the parsed value if is true or false boolean type
                    if(isEstimateParsed === true || isEstimateParsed === false){

                        return this.saleService.findAllByIsEstimate(isEstimateParsed);
                    } else {
                        throw new findAllByIsEstimateError(`"isEstimate" query parame must be either true or false`)
                    }

                } else if(!query.isEstimate){
                    throw new findAllByIsEstimateError(`You must provide the "isEstimate" parameter only, as a boolean string type. Otherwise, if you want to retrieve all the Sales you should refer to 'all' endpoint without providing any query parameters`);
                }
            } catch (error) {
                throw new HttpException({
                    status: HttpStatus.BAD_REQUEST,
                    message: error.message
                }, HttpStatus.BAD_REQUEST)
            }
        } else {
            return await this.saleService.findAll();
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

    @Delete(":id")
    async deleteById(@Param("id") id: string) {
        try {           
          return this.saleService.deleteSale(id);
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                message: error.message? error.message : "Something went wrong trying to delete sale/estimate document"
            }, HttpStatus.BAD_REQUEST)
        }
    }

    
    //We need to retrieve the product to compare its warehouseStockQuantity 
    //with the quantity of the incoming sale to check availability and over quantity attempt
}