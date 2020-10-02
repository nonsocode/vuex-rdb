import { Model } from 'src';
import { isFunction } from 'src/utils';
import { FieldDefinitionOptions } from './annotations/field';
import { getRelationshipSchema } from './relationships';
import { Relationship } from './types';


export class FieldDefinition {
  _default: any;
  _entity: string | (() => Relationship);
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
    const entityName = isFunction(this._entity) ? getRelationshipSchema(this._entity()).entityName : this._entity
    return this.isList ? [entityName] : entityName
  }
  get isList() {
    if(isFunction(this._entity)) {
      return Array.isArray(this._entity())
    }
    return !!this._list;
  } 

  setList(val: boolean) {
    this._list = !!val
  }

  setEntity(entity: string | (() => Relationship)) {
    this._entity = entity
    return this
  }

  lock(): this {
    Object.freeze(this);
    return this;
  }
}
