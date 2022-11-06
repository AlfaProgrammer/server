import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "src/mongoose-schemas/user.schema";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
    imports: [MongooseModule.forFeature([{name: "User", schema: UserSchema}])],
    //forFeatrue inica quali model dovrebbero essere registrati in questo scope
    //se vuoi esportare i modelli utilizzati in questo modulo exporta MongooseModule
    providers:[UserService],
    controllers: [UserController],
    // exports: []
})
export class UserModule{}