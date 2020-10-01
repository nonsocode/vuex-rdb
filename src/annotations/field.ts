import { Model } from 'src';
import { createObject } from 'src/utils';

export function Field() {
  return (target: Model, propname: string): void =>  {
   const constructor = target.constructor as typeof Model
   if(constructor._fields == null) {
     constructor._fields = createObject(null)
   }
   constructor._fields[propname] = true
  }
}