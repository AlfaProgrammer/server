//////////////////////////////DTOs DEFINITION///////////////////////////////
export interface UserDTO{
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    businessType: string,
    phoneNumber: string,
    location: Location,
    role: UserRole,
    active: boolean,
}

export interface ContactDTO{
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    spokenLanguage: string,
    location: Location,
    businessType: BusinessType,
    trakingCode: string,
    progress: Progress,
    creadedBy: string,
    annotations?: Annotation,
    intermediaries?: Intermediaries,
    documents?: DocumentData,

}

export interface ProductDTO{
    name: string;

    warehouseName: string,
    warehouseLocation: Location,
    warehouseStockQuantity: number,
    notifyWhenQuantityLessThen: number,

    productPositionIntoWharehouse: string,
    
    purchasePrice: number,
    sellingPrice: number,
    paymentMethod: string,
    permanentDiscount: number,

    createdBy: string, //ObjectId
    contact: string, //ObjectId
    // contactCategory: string, //forse non serve neanche 
}


export interface TaskDTO{
    title: string,
    importanceLevel: ImportanceLevel,
    description: string,
    state: TaskState,
    createdBy: string,
    assignedTo: string
}


export interface SaleDTO{
    fromCatalog: boolean,
    isEstimate?: boolean,
    product?: string, //ObjectId
    name?: string,
    discount: number, 
    paymentState: PaymentState,
    paymentMethod: string,
    quantity: number,
    date: Date,
    costPerUnit: number,
    country: Location,
    contact: string, //ObjectId
    createdBy: string //ObjectId
}

export interface ExpenseDTO extends Omit<SaleDTO, "discount">{}

export interface UpdateProductFieldDTO{
    productId: string,
    fieldToUpdate: string,
    newValue: string | number,
    parentField?: string
}


////////////////////////////////TYPES NEEDED/////////////////////////////////

type UserRole = "admin" | "editor";

type BusinessType = "individual" | "business";

type Progress = "new" | "pending" | "approved" | "notApproved" | "contacted";

type ImportanceLevel = "high" | "medium" | "low";

type PaymentState = "pending" | "paid" | "rejected" | "refund" | "approved";

type TaskState = "executed" | "notExecuted" ;

/////////////////////////////////Interfaces////////////////////////////////// 
export interface Location{
    country: string,
    state: string,
    province: string,
    city: string,
    address: string,
}

export interface Intermediaries{
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
}

export interface Annotation{
    title: string,
    descriptions: string,
    importanceLevel: ImportanceLevel,
    date: Date,
}

export interface DocumentData{
    title: string,
    docUrl: string,
    itdentifier: string,
}