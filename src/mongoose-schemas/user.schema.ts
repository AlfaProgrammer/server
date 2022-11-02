import { Schema } from "mongoose"
import { LocationSchema } from "./location.schema"

export const UserSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: { 
        type: String,  
        required: [true, "email is required"], 
        lowercase: true, 
        trim: true,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/, "Please insert a vlaid email"]
    },
    password: {
        type: String, 
        minLingth: [8, "Your password must have at least 8 characters"],
        required: true
    },
    businessType: String,
    phoneNumber: String,
    location: LocationSchema,
    role: {
        type: String,
        enum: ["admin", "editor"], // e altri che se ne possono aggiungere 
        default: "editor", // o altro
        required: true,
    },
    active: Boolean,


    // Verificare la presenza dello user dentro i documenti sotto
    // sales: {
    //     type: [
    //         {
    //             saleId: {type:Schema.Types.ObjectId, ref: "Sale", require: true},
    //             counter: {type: Number, default: 0}
    //         }
    //     ],
    //     required: false
    // },

    // expenses: [{type: Schema.Types.ObjectId, ref: "Expense"}],

})