import { Model } from 'src';
import { createObject } from 'src/utils';
import { FieldDefinition } from '../FieldDefinition';

export type FieldDefinitionOptions = {
  entity?: string | [string]
  default?():any
}

export function Field(options: FieldDefinitionOptions = {}) {
  return (target: Model, propname: string): void =>  {
   const constructor = target.constructor as typeof Model
   if(constructor._fields == null) {
     constructor._fields = createObject(null)
   }
   constructor._fields[propname] = new FieldDefinition(options)
  }
}


