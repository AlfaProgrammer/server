import { Schema } from "mongoose";

export const TaskSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    importanceLevel: {
        type: String,
        enum:{
            values: ["high", "medium", "low"],
            message: "{VALUE} level of importance is not supported"
        },
        default: "low"
    },
    description: {type: String, required: true},
    state: {
        type: String,
        enum: ["executed", "notExecuted"],
        default: "notExecuted"
    },

    createdBy: {type: Schema.Types.ObjectId, ref: "User"}, 
    assignedTo: {type: Schema.Types.ObjectId, ref: "User"}
    //se non viene assegnato a nessuno dovrebbe essere in automatico del creatore

}, {timestamps: true});