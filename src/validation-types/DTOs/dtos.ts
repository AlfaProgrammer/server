
//////////////////////////////DTOs DEFINITION///////////////////////////////
export interface CreateUserDTO{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    businessType: string;
    phoneNumber: string,
    location: Location, 
    role: UserRole,
    active: boolean,
}

export interface CreateContactDTO{
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    spokenLanguage: string;
    location: Location; 
    businessType: BusinessType;
    trakingCode: string;
    progress: Progress;
    creadedBy: string;
    annotations?: Annotation;
    intermediaries?: Intermediaries;
    documents?: DocumentData;

}


////////////////////////////////TYPES NEEDED/////////////////////////////////
type UserRole = "admin" | "editor";

type BusinessType = "individual" | "business";

type Progress = "new" | "pending" | "approved" | "notApproved" | "contacted";

type ImportanceLevel = "high" | "medium" | "low";

/////////////////////////////////Interfaces////////////////////////////////// 
export interface Location{
    country: string;
    state: string;
    province: string;
    city: string;
    address: string;
}

export interface Intermediaries{
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
}

export interface Annotation{
    title: string;
    descriptions: string;
    importanceLevel: ImportanceLevel;
    date: Date;
}

export interface DocumentData{
    title: string;
    docUrl: string;
    itdentifier: string;
}

//Keeping this object as example of in-coming request body for user creat endpoint
// const user= {
//     "firstName": "alex",
//     "email": "alexloghin@gmail.com",
//     "password": "1234",
//     "passwordConfirm": "1234", 
//     "businessType": "Influencer",
//     "phoneNumber": "4525412354125",
//     "role": "admin",
//     "active": true,
//     "country": {
//         "name": "Italy",
//         "state": "Lombardia",
//         "province": "Milano",
//         "city": "Milano"
//     }
// }