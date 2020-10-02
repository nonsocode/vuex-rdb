import { Model } from 'src';
export declare type FieldDefinitionOptions = {
    entity?: string | [string];
    default?(): any;
};
export declare function Field(options?: FieldDefinitionOptions): (target: Model, propname: string) => void;
