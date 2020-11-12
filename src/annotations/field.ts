import { Model } from '../model';
import { Relationship, RelationshipGenerator } from '../types';
import { createObject, isFunction } from '../utils';
import { FieldDefinition } from '../FieldDefinition';

export type FieldDefinitionOptions = {
  entity?: RelationshipGenerator;
  default?(): any;
};

export function Field(options: FieldDefinitionOptions | RelationshipGenerator = {}) {
  return (target: Model<any>, propname: string, other?: any): void => {
    const constructor = target.constructor as typeof Model;
    if (constructor._fields == null) {
      constructor._fields = createObject();
    }

    constructor._fields[propname] = new FieldDefinition(
      isFunction<Relationship>(options) ? { entity: options } : options
    );
  };
}
