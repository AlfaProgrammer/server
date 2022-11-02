import { Schema } from "mongoose";

export const AnnotationSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    importanceLevel: {
        type: String,
        enum:{
            values: ["high", "medium", "low"],
            message: "{VALUE} level of importance is not supported"
        },
        default: "low",
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    }
})