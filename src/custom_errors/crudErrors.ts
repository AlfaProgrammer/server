export class updateProductError extends Error{
    constructor(message){
        super(message);
        this.name = "immutable field";
    }
}
export class updateSaleError extends Error{
    constructor(message){
        super(message);
        this.name = "immutable field according to the project progresses";
    }
}