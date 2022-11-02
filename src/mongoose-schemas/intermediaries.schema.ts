import { Schema } from "mongoose";

export const IntermediariesSchema = new Schema({
    firstName: {type: String, required: [true, "Intermediary name is required"]},
    lastName: {type: String, required: true},
    email: {
        type: String, 
        required: true,
        lowercase: true, 
        trim: true,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/, "Check that the email is correct"]
    },
    phoneNumber: {type: String, required: true},
})