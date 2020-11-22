import { Schema } from '../types';
import { Relationship } from './relationhsip';

export class ItemRelationship<T extends Schema> extends Relationship<T> {}
