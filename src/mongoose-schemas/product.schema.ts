import { HydratedDocument, InferSchemaType, Schema } from "mongoose";
import { LocationSchema } from "./support-schemas/location.schema";

// per utilizzare ts per creare lo schema, devo creare una interfaccia 
    // dopo di che lo schema sarà mappato su quella interfaccia
    // essendo che ho ua ProductDTO che utilizzo già nel mio codice, lo estendo, Omettendo alcuni parametri particolari
    // come quelli che devono rappresentare un ObjectId o SottoSchema in questo modo

    // export interface IProduct extends Omit<ProductDTO, "contact" | "createdBy">{
    //     contact: Types.ObjectId;
    //     createdBy: Types.ObjectId;
    // }
    // e poi da questa Inteface creare uno schema, const ProdcutSchema = new Schema<IPorduct>

//Preferisco fare il contrario, ovvero, DEDURRE l'INTERFACCIA DALLO SCHEMA INIZIALE
export type IProduct = InferSchemaType<typeof ProductSchema>; //TypeScript Interface da usare nel codice

export type ProductDocument = HydratedDocument<IProduct>;
//https://mongoosejs.com/docs/typescript.html hydrate document che implementa un interfaccia, rappresenta
//un documento Mongoose con i method, virtuals, e tutte le features specifiche

export const ProductSchema =  new Schema({
    
    name: {type:String, required: true},
    
    warehouseName: {type: String, required: true},
    warehouseLocation: LocationSchema,
    warehouseStockQuantity: {type: Number, required: true}, //diminuire ad ogni nuova vendita per la quantità della vendita stessa
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


