import { FieldDefinitionOptions } from './annotations/field';
export declare class FieldDefinition {
    _default: any;
    _entity: string;
    _list: boolean;
    constructor(options?: FieldDefinitionOptions);
    get default(): any;
    get isRelationship(): boolean;
    get entity(): string | [string];
    get isList(): boolean;
    setList(val: boolean): void;
    setEntity(entity: string): this;
    lock(): this;
}
