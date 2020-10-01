import { Model } from 'src';
import { Relationship } from 'src/types';
import { createObject, isFunction } from 'src/utils';

export function Relationship(relationship: Relationship | (() => Relationship)) {
  return (target: Model, propname: string): void =>  {
   const constructor = target.constructor as typeof Model
   if(constructor._relationships == null) {
     constructor._relationships = createObject(null)
   }
   constructor._relationships[propname] = isFunction(relationship) ? relationship() : relationship
  }
}