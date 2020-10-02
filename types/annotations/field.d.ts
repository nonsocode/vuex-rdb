import { Model } from 'src';
import { Relationship } from 'src/types';
export declare type FieldDefinitionOptions = {
    entity?: string | (() => Relationship);
    list?: boolean;
    default?(): any;
};
export declare function Field(options?: FieldDefinitionOptions | string | [string] | (() => Relationship)): (target: Model, propname: string) => void;
