import { required } from "joi"
import { Schema } from "mongoose"
import { LocationSchema } from "./location.schema"

export const ExpenseSchema = new Schema({

    //utilizzabile anche per identificare poi le spese non da catalogo
    fromCatalog:{type: Boolean, required: true, default: false},

    product: {
        required: function() {return this.fromCatalog},
        type: Schema.Types.ObjectId, 
        ref: "Product", 
    },
    //da inserire manualmente solo se è una spesa che non proviene dal catalogo
    name: {
        type: String, 
        required: function(){this.product? false : true},
        default: function(){this.product? this.product.name : ""}// in teoria prende il nome del prodotto da catalogo se è stato inserito
    },

    //approvazione del pagamente della spesa che l'utente "x" sta per affrontare
    paymentState: {
        type: String, 
        enum: ["pending", "approved", "rejected", "refund"],
        default: "pending"
    }, 

    paymentMethod: {type:String, required: true},

    quantity: {type: Number, required: true},
    date: {type: Date, required: true},

    costPerUnit: {
        type: Number, 
        required: true,
        default: function(){return this.product && this.product.sellingPrice}
    },
    country: LocationSchema,

    // relations 
    createdBy: {type: Schema.Types.ObjectId, ref: "User"},
    contact: {type: Schema.Types.ObjectId, ref: "Contact"},

}, {timestamps: true})

module.exports = {ExpenseSchema};