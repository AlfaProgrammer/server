import { Schema } from "mongoose";

export const DocumentSchema = new Schema({
    title: {type:String, required: true},
    docUrl: {type:String, required: true},
    identifier: {type:String, required: true} 
})