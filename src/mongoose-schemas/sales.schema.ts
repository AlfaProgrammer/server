import { Schema, HydratedDocument, InferSchemaType } from "mongoose";

export type ISale = InferSchemaType<typeof SaleSchema>
export type SaleDocument = HydratedDocument<ISale>

export const SaleSchema = new Schema({

    //qhen fromCatalog param is false, instead of a sale we are creating an Estimate(same format/schema as a sale)
    fromCatalog:{type: Boolean, required: true, default: false}, //se seleziono questo, allora posso inserire i prodotti da catalogo
    isEstimate: {type: Boolean, default: function(){return !this.fromCatalog}},
    product: {
        required: function() {return this.fromCatalog},
        type: Schema.Types.ObjectId, 
        ref: "Product", 
    },

    //da inserire manualmente solo se è un preventivo (non presente nel catalogo)
    //altrimenti prende il nome del prodotto stesso
    name: {
        type: String, 
        //devo inserire il nome della vendita obbligatoriamente solo se
        //non e da catalogo... altrimenti prende il nome del prodotto
        required: [
            function(){ return !this.fromCatalog },
            "When product is not from catalog you must provide a name field for the sale you're trying to save"
        ],    
    },
    
    discount: {type: Number, required: true},

    paymentState: {
        type: String, 
        enum: ["approved","pending", "paid", "rejected", "refund"], 
        default: "pending"
    },

    paymentMethod: {type: String, required: true},
    quantity: {type: Number, required: true},
    date: {type: Date, required: true},
    costPerUnit: {
        type: Number, 
        required: true,
        default: function(){return this.product && this.product.sellingPrice}
    }, 

    /*
        Inserisci product Location 
    */
    
    //relationships
    contact: {type: Schema.Types.ObjectId, ref: "Contact", required: true}, //nome e categoria contatto mi servono a prescindere se sia da catalogo o meno 
    // contactCategory: { type: Schema.Types.ObjectId, ref: "Contact", required: true },
    //chi crea la vendita
    createdBy: {type: Schema.Types.ObjectId, ref: "User", required: true}
}, {timestamps: true})