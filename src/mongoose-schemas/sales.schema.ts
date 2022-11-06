import { Schema } from "mongoose";

export const SaleSchema = new Schema({

    //utilizzabile anche per identificare poi i preventivi
    fromCatalog:{type: Boolean, required: true, default: false}, //se seleziono questo, allora posso inserire i prodotti da catalogo

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
            "When product is not from catalog you have to provide a name field for the sale you're trying to save"
        ],        
    },
    
    discount: {type: Number, required: true},

    paymentState: {
        type: String, 
        enum: ["pending", "paid", "rejected", "refund"], 
        default: "pending"
    },

    paymentMethod: {type: String, required: true},
    quantity: {type: Number, required: true}, // <------------------- SOLVE THIS
    date: {type: Date, required: true},
    costPerUnit: {
        type: Number, 
        required: true,
        default: function(){return this.product && this.product.sellingPrice}
    }, 

    /*
        Inserisci product Location 
    */
    
    //relations
    contact: {type: Schema.Types.ObjectId, ref: "Contact", required: true}, //nome e categoria contatto mi servono a prescindere se sia da catalogo o meno 
    // contactCategory: { type: Schema.Types.ObjectId, ref: "Contact", required: true },
    //chi crea la vendita
    createdBy: {type: Schema.Types.ObjectId, required: true}
}, {timestamps: true})


//MIDDLEWARES AND CUSTOM FUNCTIONS/ACTIONS
//https://mongoosejs.com/docs/middleware.html#order
//pre e post validate vengono invocati prima di pre "save"
// SaleSchema.post("save", async function(){
//     const {warehouseStockQuantity:} = await this.populate({path: "product", select:"warehouseStockQuantity"})

//     console.log(this.product.warehouseStockQuantity);
        
// })

//callback(this, next) next è il prossimo middleware. Solitamente serve se 
//metti il middleware prima pre("save")