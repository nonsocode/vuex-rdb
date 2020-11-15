import { Model } from '../model';
import { RelationshipFactory } from '../types';
export declare type FieldDefinitionOptions = {
    entity?: RelationshipFactory;
    default?(): any;
};
export declare function Field(options?: FieldDefinitionOptions | RelationshipFactory): (target: Model<any>, propname: string, other?: any) => void;
