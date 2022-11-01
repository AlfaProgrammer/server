import * as Joi from "joi";


//Defining JOI Schema
export const userJoiSchema = Joi.object({
    firstName: Joi.string().required(),
    email: Joi.string()
        .required()
        .pattern(new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/))
        .messages({"string.pattern.base": "Invalid Email"}),
    password: Joi.string().required(),
    passwordConfirm: Joi.valid(Joi.ref("password"))
        .required()
        .messages({"any.only": "Make sure password-confirmation matches password"}),
    businessType: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    role: Joi.string().valid("admin", "editor").required(),
    active: Joi.boolean().required(),
})


//Defining DTOs
export interface CreateUserDTO{
    firstName: string;
    email: string;
    password: string;
    businessType: string;
    phoneNumber: string,
    country: String, //Object id reference
    role: UserRole,
    active: boolean,
}

enum UserRole {
    admin = "admin",
    editor = "editor"
}


//Keeping this object as example of in-coming request body 
// const user= {
//     firstName: "alex",
//     email: "alexloghin@gmail.com",
//     password: "passw1234",
//     businessType: "Influencer",
//     phoneNumber: "4525412354125",
//     country: {},
//     role: "admin",
//     active: true,
// }
