import { getIdValue } from 'src/model';
import { LoadWhereFunction, Schema } from '../types';
import { Load } from './load';
import {LoadQuery} from './load-query';
import {ItemRelationship} from '../relationships/item';

export class ModelQuery<T extends Schema> extends LoadQuery {
  protected withArgs = [];

  constructor(private schema: T) {
    super(null);
  }

  with(relationshipName: string, queryFunction?: LoadWhereFunction): this;
  with(record: string[] | Record<string, LoadWhereFunction | boolean>): this;
  with(...args) {
    this.withArgs.push(args);
    return this;
  }

  private initLoad() {
    if (!this.load) {
      this.load = new Load(new ItemRelationship(() => this.schema));
    }
    return this.load;
  }

  get(): InstanceType<T>[] {
    let items = this.schema.all() as InstanceType<T>[];
    items = items.filter((item) => this.matchItem(item));
    if (items.length) {
      if (this.withArgs.length) {
        this.initLoad();
        this.withArgs.forEach(([first, second]) => {
          super.with(first, second);
        });
      }
      items = items.map((item) => {
        return this.schema.find(getIdValue(item, this.schema), { load: this.load });
      });
    }
    return items;
  }
}
