import {Model} from '../model';
import {Schema, SchemaFactory} from '../types';
import {createObject} from '../utils';
import {ListRelationship} from '../relationships/list';

export function List<T extends Schema>(factory: SchemaFactory<T>) {
  return (target: Model, propName: string, other?: any): void => {
    const constructor = target.constructor as Schema;
    if (constructor._fields == null) {
      constructor._fields = createObject();
    }
    if (propName in constructor._fields) {
      return;
    }
    constructor._fields[propName] = List.define(factory);
  };
}

List.define = function <T extends Schema>(factory: SchemaFactory<T>): ListRelationship<T> {
  return new ListRelationship(factory);
};
