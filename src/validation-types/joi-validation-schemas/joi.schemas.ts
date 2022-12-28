import * as Joi from "joi";

//////////////////////////////////////////////////Custom RULES///////////////////////////////////////
function mongooseIdRule(){return Joi.string()
    .required()
    .regex(/^[a-fA-F0-9]{24}$/)
    .messages({
        "string.pattern.base": "{#label} must be a MongoDB ObjectID string",
})}

function locationRule(){return Joi.object({
    country: Joi.string().required(),
    state:Joi.string().required(), //stato o regione
    province: Joi.string().required(),
    city: Joi.string().required(),
    address: Joi.string().required() 
}).required()}

function importanceLevelRule(){return Joi.string().valid(
    "high",
    "medium",
    "low"
).required()}

function taskStateRule(){return Joi.string().valid(
        "executed", 
        "notExecuted"
    ).default("notExecuted").required()
}

function emailRule(){return Joi.string()
    .required()
    .email()
}

function progressRule(){return Joi.string().required().valid(
    "new",
    "pending",
    "approved",
    "notApproved",
    "contacted"
)}

function businessTypeRule(){return Joi.string().required().valid("individual", "business")}

//se ho una regola di default il required non è necessario
function paymentStateRule(){return Joi.string().valid(
    "pending",
    "paid",
    "rejected",
    "refund"
).required()}

////////////////////////////////////////////////// OTHER DTOs ///////////////////////////////////////////
export const updateProductFieldJoiSchema = Joi.object({
    productId: mongooseIdRule(),
    fieldToUpdate: Joi.string().required(),
    newValue: Joi.required(),
    parentField: Joi.string()
})


///////////////////////////////////////////////////SCHEMAS///////////////////////////////////////////////

export const userJoiSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: emailRule().messages({"string.email": "User email is invalid"}),

    password: Joi.string().required(),
    passwordConfirm: Joi.valid(Joi.ref("password"))
        .required()
        .messages({"any.only": "Make sure password-confirmation matches password"}),
    
    businessType: Joi.string().required(),
    phoneNumber: Joi.string().required(),

    role: Joi.string().valid("admin", "editor").required(),
    active: Joi.boolean().required(),

    location: locationRule(),
})

export const contactJoiSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: emailRule().messages({"string.email": "Contact email is invalid"}),

    phoneNumber: Joi.string().required(),
    spokenLanguage: Joi.string().required(),

    location: locationRule(),

    businessType: businessTypeRule(),
    iban: Joi.string().required(),
    trakingCode: Joi.string().required(),
    progress: progressRule(),

    createdBy: mongooseIdRule(),
    //Not Required fields ... 
    //Lo metto come oggetto perche aggiungo una annotazione o intermediario alla volta
    //devo validare questo dato. Il fatto che nel db sia un array, non mi deve interessare qui
    annotations: Joi.object({

        title: Joi.string().required(),
        description: Joi.string().required(),
        importanceLevel: importanceLevelRule(),

        date: Joi.date().required()
    }),

    intermediaries: Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: emailRule().messages({"string.email": "Intermediary email is invalid"}),
        phoneNumber: Joi.string().required()
    }),

    documents: Joi.object({
        title: Joi.string().required(),
        docUrl: Joi.string().required(),
        identifier: Joi.string().required()
    })
})

export const productJoiSchema = Joi.object({
    name: Joi.string().required(),

    warehouseName: Joi.string().required(),
    warehouseLocation: locationRule(),
    warehouseStockQuantity: Joi.number().required(),
    notifyWhenQuantityLessThen: Joi.number().required(),

    productPositionIntoWharehouse: Joi.string().required(),

    purchasePrice: Joi.number().required(),
    sellingPrice: Joi.number().required(),
    paymentMethod: Joi.string().required(),
    permanentDiscount: Joi.number().required(),

    contact: mongooseIdRule(),
    // contactCategory: Joi.string().required(),
    createdBy: mongooseIdRule(),
})

export const taskJoiSchema = Joi.object({

    title: Joi.string().required(),
    
    importanceLevel: importanceLevelRule(),

    description: Joi.string().required(),

    state: taskStateRule(),

    createdBy: mongooseIdRule(),
    assignedTo: mongooseIdRule(),
})

export const saleJoiSchema = Joi.object({
    fromCatalog: Joi.boolean().required(),
    isEstimate: Joi.boolean(), //it's set by default on mongoose schema. You don't need to provide it sepcifically
    product: Joi.alternatives().conditional("fromCatalog", {
        is: true,
        then: mongooseIdRule(),
        otherwise: Joi.forbidden().messages({
            "any.unknown": "the product field is required only when the product is coming from the catalog"
        }) 
    }),

    name: Joi.string(),
    discount: Joi.number().required(), 
    paymentState: paymentStateRule(),
    paymentMethod: Joi.string().required(),

    quantity: Joi.number().required(),
    date: Joi.date().required(),
    costPerUnit: Joi.number().required(),
    country: locationRule(),

    contact: mongooseIdRule(), //ObjectId
    createdBy: mongooseIdRule() //ObjectId
})

//DYNAMIC SCHEM BASED ON CONDITIONS 
/* Use 
    - alternatives 
    - conditionals
    - when 
    https://stackoverflow.com/questions/59861503/joi-validator-conditional-schema
*/