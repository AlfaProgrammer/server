import { Body, Controller, HttpException, HttpStatus, ParseIntPipe, Post, UsePipes } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserValidationPipe } from "../validation.pipe";
import { userJoiSchema, CreateUserDTO } from "./dto"
//Tutte le validazione dei dati in entrata vengon fatti nel pipe di validazione
//Gli errori rispettivi alla validazione verranno lanciati da lì. 

//Mentre gli errori che derivano dalla Scrittura o lettura sul database verranno 
//catturati e lanciati dopo il tentativo di Risolvere la Promise che la 
//funzione del service ritorna. 

//questi errori saranno generalmente legati solo al database


@Controller('user')
export class UserController{
    constructor(private userService: UserService){}

    @Post('create')
    @UsePipes(new UserValidationPipe(userJoiSchema))
    async createUser(@Body() user: CreateUserDTO){
        try {
            //tentativo di risolvere la promise
            const resp = await this.userService.createUser(user)
            return resp
        } catch (error) {  

            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                message: error
            }, HttpStatus.BAD_REQUEST)
        }        
    }
}