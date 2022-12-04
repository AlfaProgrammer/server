import {Schema} from "mongoose";


export const LocationSchema = new Schema({
    country: {type: String, required: true},
    state:{type: String, required: true}, //stato o regione
    province: {type: String, required: true},
    city: {type: String, required: true}, 
    address: {type: String, required: true},     
})