import { Model } from '../model';
import { FieldDefinitionOptions, Schema } from '../types';
import { createObject } from '../utils';
import { SimpleFieldDefinition } from '../relationships/field-definition';

export function Field(options: FieldDefinitionOptions = {}) {
  return (target: Model, propName: string): void => {
    const constructor = target.constructor as Schema;
    if (constructor._fields == null) {
      constructor._fields = createObject();
    }
    if (propName in constructor._fields) {
      return;
    }
    constructor._fields[propName] = Field.define(options);
  };
}

Field.define = function (options: FieldDefinitionOptions = {}): SimpleFieldDefinition {
  return new SimpleFieldDefinition(options);
};
