import { Injectable } from "@nestjs/common";
import { Model } from "mongoose" ;
import { InjectModel } from "@nestjs/mongoose";
import { IUser, UserDocument, UserSchema } from "src/mongoose-schemas/user.schema";
import { UserDTO } from "src/validation-types/DTOs/dtos";


//se le funzioni sul DB non ritornano una Promise non posso usare il catch per 
//cattura gli errori quando cerchero di risolverle nei controller

@Injectable()
export class UserService{
    constructor(@InjectModel("User") private userModel: Model<UserDocument>){}

    async createUser(userData: UserDTO): Promise<IUser> {
        
        const newUser = new this.userModel(userData);
        return newUser.save(); //Promise to save the document
    }

    async findAll(): Promise<IUser[]>{
        return this.userModel.find();
    }

    async getByEmail(email:string){
        return await this.userModel.where("email").equals(email);
    }

    async getById(userId:string): Promise<IUser>{
        return this.userModel.findById(userId);
    }

    async deleteUsers(userId){
        return await this.userModel.deleteOne({"_id": userId});
    }
}