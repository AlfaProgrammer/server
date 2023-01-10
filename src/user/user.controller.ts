import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Query, UsePipes } from "@nestjs/common";
import { UserService } from "./user.service";
import { JoiValidationPipe } from "../validation.pipe";
import { userJoiSchema } from "src/validation-types/joi-validation-schemas";
import { UserDTO } from "src/validation-types/DTOs/dtos";
//Tutte le validazione dei dati in entrata vengon fatti nel pipe di validazione
//Gli errori rispettivi alla validazione verranno lanciati da lì. 

//Mentre gli errori che derivano dalla Scrittura o lettura sul database verranno 
//catturati e lanciati dopo il tentativo di Risolvere la Promise che la 
//funzione del service ritorna. 

//questi errori saranno generalmente legati solo al database


@Controller('users')
export class UserController{
    constructor(private userService: UserService){}

    @Post('create')
    @UsePipes(new JoiValidationPipe(userJoiSchema))
    async createUser(@Body() userPayload: UserDTO){
        try {
            //trying to solve the promise
            const newUser = await this.userService.createUser(userPayload)
            return newUser

        } catch (error) {  

            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                message: error.message
            }, HttpStatus.BAD_REQUEST)
        }        
    }

    @Get()
    async getUserByEmail(@Query("email") email: string){
        try {
            if(email){
                const user = this.userService.getByEmail(email);
                return user;
            } else {
                throw new Error("You must provide an email query param")
            }
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                message: error.message? error.message : `Something went wrong trying retrieve a user document by email "${email}" `
            }, HttpStatus.BAD_REQUEST)
        }
    }

    @Get("all")
    async getAllUsers(){
        try {
            return await this.userService.findAll();
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                message: error.message
            }, HttpStatus.BAD_REQUEST)
        }
    }
    @Get(":id")
    async getUserById(@Param("id") userId: string){
        try {
            const user = this.userService.getById(userId);
            return user;
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                message: error.message? error.message : `Something went wrong trying retrieve a user document by id "${userId}" `
            }, HttpStatus.BAD_REQUEST)
        }        
    }


    @Delete(":id")
    async deleteById(@Param("id") userId: string) {
        try {           
            return this.userService.deleteUsers(userId);
          } catch (error) {
              throw new HttpException({
                  status: HttpStatus.BAD_REQUEST,
                  message: error.message? error.message : "Something went wrong trying to delete user document"
              }, HttpStatus.BAD_REQUEST)
          }
    }


}

