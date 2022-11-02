import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose";
import { ContactSchema } from "src/mongoose-schemas/contact.schema";

@Injectable()
export class ContactService{
    constructor(@InjectModel("Contacts") private contactModel: Model<typeof ContactSchema>){}
    
    async createContact(contactData): Promise<typeof ContactSchema> {
        
        const createUser = await new this.contactModel(contactData);
        return createUser.save(); //Promise di salvare il model
    }
}