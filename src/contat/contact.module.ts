import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose"
import { ContactSchema } from "src/mongoose-schemas/contact.schema";
import { ContactController } from "./contact.controller";
import { ContactService } from "./contact.service";

@Module({
    imports:[MongooseModule.forFeature([{name: "Contact", schema: ContactSchema}])],
    providers: [ContactService],
    controllers: [ContactController]
})
export class ContactModule{}