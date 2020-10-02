import { FieldDefinitionOptions } from './annotations/field';
export declare class FieldDefinition {
    _default: any;
    entity: string | [string];
    constructor(options?: FieldDefinitionOptions);
    get default(): any;
    get isRelationship(): boolean;
    get isList(): boolean;
}
