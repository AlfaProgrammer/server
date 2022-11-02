import { Injectable } from "@nestjs/common";
import { Model } from "mongoose" ;
import { InjectModel } from "@nestjs/mongoose";
import { UserSchema } from "src/mongoose-schemas/user.schema";
import { CreateUserDTO } from "src/validation-types/DTOs/dtos";


//se le funzioni sul DB non ritornano una Promise non posso usare il catch per 
//cattura gli errori quando cerchero di risolverle nei controller

@Injectable()
export class UserService{
    constructor(@InjectModel("Users") private userModel: Model<typeof UserSchema>){}

    async createUser(userData: CreateUserDTO): Promise<typeof UserSchema> {
        
        const createUser = await new this.userModel(userData);
        return createUser.save(); //Promise di salvare il model
    }
}