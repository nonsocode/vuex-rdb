import { Model } from '../model';
import { RelationshipGenerator } from '../types';
export declare type FieldDefinitionOptions = {
    entity?: RelationshipGenerator;
    default?(): any;
};
export declare function Field(options?: FieldDefinitionOptions | RelationshipGenerator): (target: Model<any>, propname: string, other?: any) => void;
