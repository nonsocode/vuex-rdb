import { Model } from 'src';
import { Relationship } from 'src/types';
import { createObject, isFunction } from 'src/utils';
import { FieldDefinition } from '../FieldDefinition';

export type FieldDefinitionOptions = {
  entity?: string | (() => Relationship),
  list?: boolean,
  default?():any
}

export function Field(options: FieldDefinitionOptions | string | [string] | (() => Relationship) = {} ) {
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
   } else if(isFunction(options)) {
     definition.setEntity(options)
   } 
   else {
     definition = new FieldDefinition(options)
   }
   constructor._fields[propname] = definition.lock();
  }
}


