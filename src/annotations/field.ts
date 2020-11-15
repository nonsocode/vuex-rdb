import { Model } from '../model';
import { Relationship, RelationshipFactory, Schema } from '../types';
import { createObject, isFunction } from '../utils';
import { FieldDefinition } from '../FieldDefinition';

export type FieldDefinitionOptions = {
  entity?: RelationshipFactory;
  default?(): any;
};

export function Field(options: FieldDefinitionOptions | RelationshipFactory = {}) {
  return (target: Model<any>, propname: string, other?: any): void => {
    const constructor = target.constructor as Schema;
    if (constructor._fields == null) {
      constructor._fields = createObject();
    }

    constructor._fields[propname] = new FieldDefinition(isFunction(options) ? { entity: options } : options);
  };
}
