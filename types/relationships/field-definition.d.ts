import { FieldDefinitionOptions } from '../types';
export declare abstract class FieldDefinition {
    private readonly _default?;
    protected constructor(options?: FieldDefinitionOptions);
    get default(): any;
}
export declare class SimpleFieldDefinition extends FieldDefinition {
    constructor(options?: FieldDefinitionOptions);
}
