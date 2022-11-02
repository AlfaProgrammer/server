import { Schema } from "mongoose"
import { AnnotationSchema } from "./annotation.schema"
import { DocumentSchema } from "./document.schema"
import { IntermediariesSchema } from "./intermediaries.schema"
import { LocationSchema } from "./location.schema"

export const ContactSchema = new Schema({
    //required fields firs
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {
        type: String, 
        required: [true, "email is required"], 
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/, "Please insert a valid email"]
    },
    phoneNumber: {type: String, required: true},
    spokenLanguage: {type: String, required: true},
    location: LocationSchema,
    businessType: {type: String, enum: ["individual", "business"]},
    iban: {type: String, required: true},
    trakingCode: {type: String, unique: true},
    progress: {
        type: String,
        enum: ["new", "pending", "approved", "notApproved", "contacted"],
        default: "new"
    },
    createdBy: {type: Schema.Types.ObjectId, ref: "User"},
////le seguenti opzioni le trovi quanto vai sulla show del singolo contatto./////
// Non dovrebbero essere richiesto obbigatoriamente. Xke vengono aggiunte in un secodo momento. Anche dopo giorni
//dalla creazione del contatto.

    //Note per questo contatto. appunti che si fanno al volo
    annotations:[ AnnotationSchema ],
    //Lista di intermediari per questo contatto. Penso che un contatto possa essere anche un'azienda.
    //Questa quindi è la lista delle persone con cui parli in qulla azienda
    intermediaries:[IntermediariesSchema],
    
    //LISTA DI DOCUMENTI PER QUESTO UTENTE(puo essere che siano troppe info, chissa quanti documenti si possono avere un contatto)
    documents: [DocumentSchema]

}, {timestamps: true})