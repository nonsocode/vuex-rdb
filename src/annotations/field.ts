import { Model } from 'src';
import { createObject } from 'src/utils';
import { FieldDefinition } from '../FieldDefinition';

export type FieldDefinitionOptions = {
  entity?: string,
  list?: boolean,
  default?():any
}

export function Field(options: FieldDefinitionOptions | string | [string] = {} ) {
  return (target: Model, propname: string): void =>  {
   const constructor = target.constructor as typeof Model
   if(constructor._fields == null) {
     constructor._fields = createObject({})
   }
   let definition = new FieldDefinition();
   if(typeof options == 'string') {
    definition.setEntity(options)
   } else if(Array.isArray(options)) {
    definition.setEntity(options[0]).setList(true)
   } else {
     definition = new FieldDefinition(options)
   }
   constructor._fields[propname] = definition.lock();
  }
}


