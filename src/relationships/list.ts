import {Schema} from '../types';
import {ListLike, Rel} from './relationhsip';
import {List} from '../annotations/list';

export class ListRelationship<T extends Schema> extends ListLike<T> {
}
