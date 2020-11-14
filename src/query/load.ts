import {LoadWhereFunction, Relationship, RelationshipModel, WhereFunction} from '../types';
import {createObject, isFunction, isString} from '../utils';
import {getLoads} from './query-utils';
import {ContextualQuery} from "./contextual-query";

export class Load<T extends Relationship = Relationship> {
  loads: Map<string, Load> = new Map();
  conditions: Set<ContextualQuery<T>> = new Set();

  constructor(protected relationship: T) {
  }

  addLoad(name: string, load: Load) {
    this.loads.set(name, load);
  }

  getLoad(name) {
    return this.loads.get(name);
  }

  has(name: string): boolean {
    return this.loads.has(name);
  }

  addCondition<P extends ContextualQuery<T>>(where: P) {
    this.conditions.add(where);
  }

  apply(data: RelationshipModel<T>) {
    if (this.conditions.size == 0 || data == null) return data;
    const conditions = [...this.conditions]
    if (Array.isArray(this.relationship)) {
      return (data as RelationshipModel<T>[]).filter(item => {
        return conditions.some(condition => condition.matchItem(item))
      })
    } else if (conditions.some(condition => condition.matchItem(data))) {
      return data;
    }
  }

  getRelationship(): T {
    return this.relationship;
  }

  parse(relationshipName: string, queryFunction: LoadWhereFunction): this;
  parse(relationshipName: string | string[] | Record<string, LoadWhereFunction | true>): this;
  parse(...args: any[]): this {
    const rawLoads = this.parseRawLoadArgs(...args);

    Object.entries(rawLoads).forEach(([key, val]) => {
      const segments = key.split('.'); // [user, posts, *, issues, comments]

      const loads = segments.reduce((loads, segment) => getLoads(loads, segment), [this as Load]);
      loads.forEach(load => {
        if (isFunction(val)) {
          const query = new LoadQuery(load);
          val.call(null, query);
          load.addCondition(query)
        } else load.addCondition(new ContextualQuery().where(true));
      });
    });
    return this;
  }

  private parseRawLoadArgs(...args): Record<string, WhereFunction<unknown> | true> {
    let rawLoads: Record<string, WhereFunction<unknown> | true> = createObject();
    const [firstArg, secondArg] = args;
    switch (args.length) {
      case 1:
        if (Array.isArray(firstArg)) {
          firstArg.forEach(item => (rawLoads[item] = true));
        } else if (isString) {
          rawLoads[firstArg] = true;
        } else {
          rawLoads = createObject(firstArg);
        }
        break;
      case 2:
        rawLoads[firstArg] = secondArg;
        break;
      default:
        throw new Error('Invalid arguments supplied');
    }
    return rawLoads;
  }
}

const withitems = {
  'posts.comments': query => {
    query.where('timestamp', '>', 112212).with({
      user: query => {
        query.where('id', 1).with('features');
      }
    });
  },
  'posts.comments.user': query => {
    query.where('id', 2);
  }
};
const transformed = {
  posts: {
    comments: {}
  }
};


export class LoadQuery extends ContextualQuery<Load> {
  constructor(private load: Load) {
    super();
  }

  with(relationshipName: string, queryFunction: LoadWhereFunction): this;
  with(record: string | string[] | Record<string, LoadWhereFunction | boolean>): this;
  with(...args) {
    switch (args.length) {
      case 1:
        this.load.parse(args[0]);
        break;
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
