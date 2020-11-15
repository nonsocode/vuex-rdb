import { isFunction } from 'src/utils';
import { FieldDefinitionOptions } from './annotations/field';
import { RelationshipFactory, Relationship } from './types';


export class FieldDefinition{
  _default: any;
  _entity: RelationshipFactory;
  _list: boolean;

  constructor(options: FieldDefinitionOptions = {}) {
    this._entity = options.entity;
    this._default = options.default;
  }


  get default() {
    return isFunction(this._default) ? this._default() : this._default;
  }

  get isRelationship(): boolean {
    return this.entity != null
  }

  get entity(): Relationship {
    return this._entity?.()
  }

  get isList() {
    if(this._list != null) {
      return this._list;
    }
    return this._list = Array.isArray(this.entity)
  } 
}
