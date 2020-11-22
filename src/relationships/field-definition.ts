import { isFunction } from 'src/utils';
import { FieldDefinitionOptions, Factory } from '../types';

export abstract class FieldDefinition {
  private readonly _default?: Factory;

  protected constructor(options: FieldDefinitionOptions = {}) {
    this._default = isFunction(options) ? options() : options.default;
  }

  get default() {
    return isFunction(this._default) ? this._default() : this._default;
  }
}

export class SimpleFieldDefinition extends FieldDefinition {
  constructor(options: FieldDefinitionOptions = {}) {
    super(options);
  }
}
