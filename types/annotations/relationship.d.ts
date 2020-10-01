import { Model } from 'src';
import { Relationship } from 'src/types';
export declare function Relationship(relationship: Relationship | (() => Relationship)): (target: Model, propname: string) => void;
