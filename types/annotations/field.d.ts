import { Model } from '../model';
import { FieldDefinitionOptions } from '../types';
import { SimpleFieldDefinition } from '../relationships/field-definition';
export declare function Field(options?: FieldDefinitionOptions): (target: Model, propName: string) => void;
export declare namespace Field {
    var define: (options?: FieldDefinitionOptions) => SimpleFieldDefinition;
}
