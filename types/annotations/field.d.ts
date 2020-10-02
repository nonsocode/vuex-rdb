import { Model } from 'src';
export declare type FieldDefinitionOptions = {
    entity?: string;
    list?: boolean;
    default?(): any;
};
export declare function Field(options?: FieldDefinitionOptions | string | [string]): (target: Model, propname: string) => void;
