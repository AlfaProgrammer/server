import * as Joi from "joi";

export const userJoiSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string()
        .required()
        .email()
        .messages({"string.email": "User email is invalid"}),
    password: Joi.string().required(),
    passwordConfirm: Joi.valid(Joi.ref("password"))
        .required()
        .messages({"any.only": "Make sure password-confirmation matches password"}),
    businessType: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    role: Joi.string().valid("admin", "editor").required(),
    active: Joi.boolean().required(),
    location: Joi.object({
        country: Joi.string().required(),
        state:Joi.string().required(), //stato o regione
        province: Joi.string().required(),
        city: Joi.string().required(),
        address: Joi.string().required() 
    }).required(),
})



export const contactJoiSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string()
        .required()
        .email()
        .messages({"string.email": "Contact email is invalid"}),
    phoneNumber: Joi.string().required(),
    spokenLanguage: Joi.string().required(),
    location: Joi.object({
        country: Joi.string().required(),
        state:Joi.string().required(), //stato o regione
        province: Joi.string().required(),
        city: Joi.string().required(),
        address: Joi.string().required()
    }).required(),
    businessType: Joi.string().required().valid("individual", "business"),
    iban: Joi.string().required(),
    trakingCode: Joi.string().required(),
    progress: Joi.string().required().valid(
        "new",
        "pending",
        "approved",
        "notApproved",
        "contacted"
    ),
    createdBy: Joi.string()
        .required()
        .alphanum()
        .length(24) //la grandezza di un ObjectId in MongoDB
        .messages({
            "string.length": "Length must be 24chars long",
            "any.required": "createdBy id is needed"
        }),
    //Not Required fields ... 
    //Lo metto come oggetto perche aggiungo una annotazione o intermediario alla volta
    //devo validare questo dato. Il fatto che nel db sia un array, non mi deve interessare qui
    annotations: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        importanceLevel: Joi.string().required().valid(
            "high",
            "medium",
            "low"
        ),
        date: Joi.date().required()
    }),

    intermediaries: Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string()
            .required()
            .email()
            .messages({"string.email": "Intermediary email is invalid"}),
        phoneNumber: Joi.string().required()
    }),

    documents: Joi.object({
        title: Joi.string().required(),
        docUrl: Joi.string().required(),
        identifier: Joi.string().required()
    })
})