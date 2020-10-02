import { isFunction } from 'src/utils';
import { FieldDefinitionOptions } from './annotations/field';


export class FieldDefinition {
  _default: any;
  _entity: string;
  _list: boolean;

  constructor(options: FieldDefinitionOptions = {}) {
    this._entity = options.entity;
    this._default = options.default;
    this._list = options.list
  }


  get default() {
    return isFunction(this._default) ? this._default() : this._default;
  }

  get isRelationship() {
    return !([null, undefined].includes(this.entity));
  }

  get entity(): string | [string] {
    return this.isList ? [this._entity] : this._entity
  }
  get isList() {
    return !!this._list;
  } 

  setList(val: boolean) {
    this._list = !!val
  }

  setEntity(entity: string) {
    this._entity = entity
    return this
  }

  lock(): this {
    Object.freeze(this);
    return this;
  }
}
