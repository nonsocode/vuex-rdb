import { isFunction } from 'src/utils';
import { FieldDefinitionOptions } from './annotations/field';


export class FieldDefinition {
  _default: any;
  entity: string | [string];

  constructor(options: FieldDefinitionOptions = {}) {
    this.entity = options.entity;
    this._default = options.default;
  }


  get default() {
    return isFunction(this._default) ? this._default() : this._default;
  }

  get isRelationship() {
    return !([null, undefined].includes(this.entity));
  }
  get isList() {
    return this.isRelationship && Array.isArray(this.entity);
  }
}
