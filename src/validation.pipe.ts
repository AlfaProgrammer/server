import { PipeTransform, Injectable, ArgumentMetadata, HttpException, HttpStatus } from '@nestjs/common';
import { ObjectSchema } from 'joi';


@Injectable()
export class UserValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

//value - argomento del method attualmente processato prima che venga ricevuto dal 
//handler della rotta che stai chiamando (param, body della chiamata)
  transform(value: any, metadata: ArgumentMetadata) {
    const { error } = this.schema.validate(value, {abortEarly: false});
    if (error) {      
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: error.details
      }, HttpStatus.BAD_REQUEST);
    }
    return value;
  }
}

//l'argomento che passerai al costruttore di questa calsse dovra essere uno schema
// di JOI. const userSchema = Joi.object({.....}) 
// https://joi.dev/api/?v=17.6.4