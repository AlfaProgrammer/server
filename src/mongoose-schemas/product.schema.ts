import { Schema } from "mongoose";
import { LocationSchema } from "./location.schema";

export const ProductSchema =  new Schema({
    
    name: {type:String, required: true},
    
    warehouseName: {type: String, required: true},
    warehouseLocation: LocationSchema,
    warehouseStockQuantity: {type: Number, required: true},
    notifyWhenQuantityLessThen: {type: Number, required: true}, //Quando la quantità è inferiore a questa, notifica prodotto scarseggia
    
    productPositionIntoWharehouse: {type: String, required: true},
    
    purchasePrice: {type: Number, required: true},
    sellingPrice: {type: Number, required: true},
    paymentMethod: {type: String, required: true},
    permanentDiscount: {type: Number, required: true},
    
    contact: {
        type: Schema.Types.ObjectId, 
        ref: "Contact",
        required: true
    },
    //Non penso debba essere un ObjectId. A me serve solo la category come stringa,
    //Che in fase di creazione recuperare dal contact 
    //penso che a questo punto non serva nemmeno se hai gia il contatto qui
    //insieme a tutte le sue caratteristiche (cervello In PAPPA)
    // contactCategory: {
    //     type: String, 
    //     required: true
    // },
    createdBy: {type: Schema.Types.ObjectId, ref: "User", required: true}, 
    
}, {timestamps: true});
    
