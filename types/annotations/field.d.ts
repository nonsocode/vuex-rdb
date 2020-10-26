import { Model } from 'src';
import { RelationshipGenerator } from 'src/types';
export declare type FieldDefinitionOptions = {
    entity?: RelationshipGenerator;
    default?(): any;
};
export declare function Field(options?: FieldDefinitionOptions | RelationshipGenerator): (target: Model, propname: string) => void;
