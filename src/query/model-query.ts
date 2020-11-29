import { LoadWhereFunction, Schema } from '../types';
import { Load } from './load';
import { LoadQuery } from './load-query';
import { ItemRelationship } from '../relationships/item';
import { getIdValue } from '../modelUtils';

export class ModelQuery<T extends Schema> extends LoadQuery {
  protected withArgs = [];

  constructor(private schema: T) {
    super(null);
  }

  with(relationshipName: string, queryFunction?: LoadWhereFunction): this;
  with(record: string[] | Record<string, LoadWhereFunction | boolean>): this;
  with(...args) {
    if (this.load) return super.with(args[0], args[1]);
    this.withArgs.push(args);
    return this;
  }

  private initLoad(): Load {
    if (!this.load && this.withArgs.length) {
      this.load = new Load(new ItemRelationship(() => this.schema));
      this.withArgs.forEach(([first, second]) => {
        super.with(first, second);
      });
    }
    return this.load;
  }

  get(): InstanceType<T>[] {
    let items = this.schema.all() as InstanceType<T>[];
    items = this.apply(items);
    if (this.initLoad()) {
      return items.map((item) => {
        return this.schema.find(getIdValue(item, this.schema), { load: this.load });
      });
    }
    return items;
  }

  first(): InstanceType<T> {
    let items = <InstanceType<T>[]>this.schema.all();
    const first = items.find((item) => this.matchesItem(item));
    if (!first) return;
    if (this.initLoad()) {
      return this.schema.find(getIdValue(first, this.schema), { load: this.load });
    }
    return first;
  }
}
