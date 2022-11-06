import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Query, UsePipes } from "@nestjs/common";
import { ContactDTO } from "src/validation-types/DTOs/dtos";
import { contactJoiSchema } from "src/validation-types/joi-validation-schemas";
import { JoiValidationPipe } from "src/validation.pipe";
import { ContactService } from "./contact.service";


@Controller("contacts")
export class ContactController{
    constructor(private contactService: ContactService){}
    
    @Post("create")
    @UsePipes(new JoiValidationPipe(contactJoiSchema))
    async createContact(@Body() data: ContactDTO){        
        try {
            const contact = await this.contactService.createContact(data);
            return contact
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.BAD_GATEWAY,
                message: error.message
            }, HttpStatus.BAD_REQUEST)
        }
    }

    @Get()
    getContact(@Query("name") name){
        // return this.contactService.getContactCreator(name)
        try {
            const contact = this.contactService.getCreatorOf(name)
            return contact
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.BAD_GATEWAY,
                message: error.message
            }, HttpStatus.BAD_REQUEST)     
        }
    }
}