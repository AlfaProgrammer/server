export class updateProductError extends Error{
    constructor(message){
        super(message);
        this.name = "forbidden_field";
    }
}