import { FieldDefinitionOptions } from './annotations/field';
import { RelationshipGenerator, Relationship } from './types';
export declare class FieldDefinition {
    _default: any;
    _entity: RelationshipGenerator;
    _list: boolean;
    constructor(options?: FieldDefinitionOptions);
    get default(): any;
    get isRelationship(): boolean;
    get entity(): Relationship;
    get isList(): boolean;
}
