import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose";
import { ContactSchema } from "src/mongoose-schemas/contact.schema";
import { ContactDTO } from "src/validation-types/DTOs/dtos";

@Injectable()
export class ContactService{
    constructor(@InjectModel("Contact") private contactModel: Model<typeof ContactSchema>){}
    
    async createContact(contactData: ContactDTO): Promise<typeof ContactSchema> {
        
        const createUser = await new this.contactModel(contactData);
        return createUser.save(); //Promise di salvare il model
    }

    async getCreatorOf(name){
        return await this.contactModel.findOne({firstName: name}, {
            _id: 1
        })
        .populate("createdBy", {
            firstName: 1,
            _id: 0
        }).exec();       
    }
}