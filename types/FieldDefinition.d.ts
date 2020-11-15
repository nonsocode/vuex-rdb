import { FieldDefinitionOptions } from './annotations/field';
import { RelationshipFactory, Relationship } from './types';
export declare class FieldDefinition {
    _default: any;
    _entity: RelationshipFactory;
    _list: boolean;
    constructor(options?: FieldDefinitionOptions);
    get default(): any;
    get isRelationship(): boolean;
    get entity(): Relationship;
    get isList(): boolean;
}
