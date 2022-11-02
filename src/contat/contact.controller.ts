import { Body, Controller, HttpException, HttpStatus, Post, UsePipes } from "@nestjs/common";
import { CreateContactDTO } from "src/validation-types/DTOs/dtos";
import { contactJoiSchema } from "src/validation-types/joi-validation-schemas";
import { JoiValidationPipe } from "src/validation.pipe";
import { ContactService } from "./contact.service";


@Controller("contacts")
export class ContactController{
    constructor(private contactService: ContactService){}
    
    @Post("create")
    @UsePipes(new JoiValidationPipe(contactJoiSchema))
    async createContact(@Body() data: CreateContactDTO){        
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
}