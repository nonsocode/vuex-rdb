import { getIdValue } from 'src/model';
import {LoadWhereFunction, Schema} from '../types';
import { Load } from './load';
import {ContextualQuery} from "./contextual-query";

export class ModelQuery<T extends Schema> extends ContextualQuery<T> {
  load: Load<Schema>;
  withArgs: any = [];

  constructor(private schema: T) {
    super();
  }

  with(relationshipName: string, queryFunction: LoadWhereFunction): this;
  with(record: string | string[] | Record<string, LoadWhereFunction | boolean>): this;
  with(...args) {
    this.withArgs.push(args);

    return this;
  }

  private initLoad() {
    if (!this.load) {
      this.load = new Load(this.schema);
    }
  }

  private initLoadArgs(...args) {
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

  get(): InstanceType<T>[] {
    let items = this.schema.all() as InstanceType<T>[];
    items = items.filter(item => this.matchItem(item));
    if (items.length) {
      if (this.withArgs.length) {
        this.initLoad();
        this.withArgs.forEach(arg => {
          this.initLoadArgs(...arg);
        });
      }
      items = items.map(item => {
        return this.schema.find(getIdValue(item, this.schema), { load: this.load });
      });
    }
    return items;
  }
}
