import { LoadWhereFunction } from '../types';
import { ContextualQuery } from './contextual-query';
import { Load } from './load';

export class LoadQuery extends ContextualQuery<Load> {
  constructor(protected load: Load) {
    super();
  }

  with(relationshipName: string, queryFunction?: LoadWhereFunction): this;
  with(record:  string | string[] | Record<string, LoadWhereFunction | boolean>): this;
  with(...args) {
    switch (args.length) {
      case 1:
      case 2:
        this.load.parse(args[0], args[1]);
        break;
      default:
        throw new Error('Invalid arguments supplied');
    }
    return this;
  }

  get(): any {
    throw new Error('Method not implemented.');
  }
}
