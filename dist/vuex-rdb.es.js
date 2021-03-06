import Vue from 'vue';

const identity = (k) => k;
function isFunction(fn) {
    return fn instanceof Function;
}
function isBoolean(arg) {
    return arg === true || arg === false;
}
function isString(string) {
    return typeof string === 'string';
}
function createObject(object) {
    const o = Object.create(null);
    return object ? Object.assign(o, object) : o;
}
const get = (path, obj, defaultVal = undefined) => {
    const returnable = path.split('.').reduce((acc, i) => {
        return acc === null ? undefined : acc && acc[i];
    }, obj || createObject());
    return returnable === undefined ? defaultVal : returnable;
};
function hasSeen(item, nodeTree) {
    if (!nodeTree)
        return false;
    while (nodeTree) {
        if (nodeTree.item == item)
            return true;
        nodeTree = nodeTree.parentNode;
    }
    return false;
}

class FieldDefinition {
    constructor(options = {}) {
        this._default = isFunction(options) ? options() : options.default;
    }
    get default() {
        return isFunction(this._default) ? this._default() : this._default;
    }
}
class SimpleFieldDefinition extends FieldDefinition {
    constructor(options = {}) {
        super(options);
    }
}

function registerSchema(schema, store, namespace) {
    if (!schema._fields) {
        Object.defineProperty(schema, '_fields', {
            value: createObject({}),
        });
    }
    if (typeof schema.id == 'string' && !(schema.id in schema._fields)) {
        schema._fields[schema.id] = new SimpleFieldDefinition();
    }
    if (schema.fields) {
        Object.assign(schema._fields, schema.fields);
    }
    Object.defineProperties(schema, {
        _namespace: { value: namespace },
        _store: { value: store },
    });
    Object.freeze(schema);
}

var Mutations;
(function (Mutations) {
    Mutations["ADD_ALL"] = "ADD_ALL";
    Mutations["PATCH_TEMPS"] = "PATCH_TEMPS";
    Mutations["SET_PROP"] = "SET_PROP";
    Mutations["SET_INDEX"] = "SET_INDEX";
})(Mutations || (Mutations = {}));
var Actions;
(function (Actions) {
    Actions["ADD"] = "add";
    Actions["ADD_RELATED"] = "addRelated";
    Actions["REMOVE_RELATED"] = "removeRelated";
    Actions["UPDATE"] = "update";
})(Actions || (Actions = {}));
var Getters;
(function (Getters) {
    Getters["FIND"] = "find";
    Getters["GET_RAW"] = "getRaw";
    Getters["FIND_BY_IDS"] = "findByIds";
    Getters["ALL"] = "all";
    Getters["GET_INDEX"] = "getIndex";
})(Getters || (Getters = {}));

class Query {
    constructor() {
        this.whereAnds = [];
        this.whereOrs = [];
    }
    where(...args) {
        this.addWhere('and', ...args);
        return this;
    }
    orWhere(...args) {
        this.addWhere('or', ...args);
        return this;
    }
    addWhere(type, ...args) {
        const wheres = type == 'and' ? this.whereAnds : this.whereOrs;
        switch (args.length) {
            case 1:
                if (!isFunction(args[0]) && !isBoolean(args[0])) {
                    throw new Error('Argument should be a function or boolean');
                }
                if (isBoolean(args[0])) {
                    wheres.push({
                        operand: args[0],
                    });
                }
                else {
                    wheres.push({
                        key: args[0],
                    });
                }
                break;
            case 2:
                wheres.push({
                    key: args[0],
                    value: args[1],
                });
                break;
            case 3:
                wheres.push({
                    key: args[0],
                    operand: args[1],
                    value: args[2],
                });
                break;
            default:
                throw new Error('Illegal arguments supplied');
        }
    }
}

class ContextualQuery extends Query {
    constructor(context) {
        super();
        this.context = context;
    }
    matchesItem(item) {
        if (!this.whereAnds.length && !this.whereOrs.length)
            return true;
        const result = [];
        const comparator = getComparator(item);
        result.push(!!(this.whereAnds.length && this.whereAnds.every(comparator)));
        result.push(!!(this.whereOrs.length && this.whereOrs.some(comparator)));
        return result.some(identity);
    }
    matchesSomeItems(items) {
        return items.every((item) => this.matchesItem(item));
    }
    matchesAllItems(items) {
        return items.some((item) => this.matchesItem(item));
    }
    _filter(items) {
        return items.filter((item) => this.matchesItem(item));
    }
    get() {
        return this.matchesItem(this.context);
    }
}

/**
 * The idea is to have more definitive types of relationships
 *
 * Ethe annotations could be plenty
 *
 * ```
 * class User {
 *
 *   @HasMany(() => Post, 'user_id') posts: Post[];
 *   @HasOne(() => Profile, 'user_id') profile: Profile;
 *   @List(() => Post) otherPosts: Post[];
 *   @Item(() => Address) address: Address;
 * }
 * ```
 *
 */
class Relationship extends FieldDefinition {
    constructor(factory, parentFactory) {
        super();
        this.factory = factory;
        this.parentFactory = parentFactory;
    }
    get schema() {
        return this.factory();
    }
    get parentSchema() {
        var _a;
        return (_a = this.parentFactory) === null || _a === void 0 ? void 0 : _a.call(this);
    }
}
class ListLike extends Relationship {
}

const getComparator = (item) => (where) => {
    if (isFunction(where.key)) {
        const query = new ContextualQuery(item);
        let result = where.key.call(null, query, item);
        if (typeof result == 'boolean') {
            return result;
        }
        return query.get();
    }
    else if (isString(where.key) && isFunction(where.value)) {
        const value = get(where.key, item);
        return !!where.value.call(null, value);
    }
    else if (isBoolean(where.operand)) {
        return where.operand;
    }
    else if (isString(where.key) && !isFunction(where.value)) {
        let resolved = get(where.key, item);
        const isArray = Array.isArray(resolved);
        resolved = isArray && where.operand != 'in' ? resolved.length : resolved;
        switch (where.operand) {
            case '!=':
                return resolved != where.value;
            case '>':
                return resolved > where.value;
            case '>=':
                return resolved >= where.value;
            case '<':
                return resolved < where.value;
            case '<=':
                return resolved <= where.value;
            case 'in':
                return where.value.includes(resolved);
            case '=':
            default:
                return resolved == where.value;
        }
    }
};
const getSortComparator = (orders) => {
    const l = orders.length;
    const parsed = orders.map((order) => [order.key, order.direction == 'asc' ? 1 : -1]);
    return (a, b) => {
        for (let i = 0; i < l; i++) {
            const [key, dir] = parsed[i];
            if (a[key] < b[key])
                return -1 * dir;
            if (a[key] > b[key])
                return dir;
        }
        return 0;
    };
};
const addToLoads = (key, relationship, originalLoad, newLoads) => {
    if (originalLoad.has(key)) {
        newLoads.push(originalLoad.getLoad(key));
    }
    else {
        const newLoad = new Load(relationship);
        originalLoad.addLoad(key, newLoad);
        newLoads.push(newLoad);
    }
};
function getLoads(loads, key) {
    const newLoads = [];
    for (const load of loads) {
        const schema = load.getRelationship().schema;
        if (key === '*') {
            Object.entries(schema._fields)
                .filter(([, fieldDef]) => fieldDef instanceof Relationship)
                .forEach(([key, value]) => {
                addToLoads(key, value, load, newLoads);
            });
        }
        else if (!schema._fields[key] || !(schema._fields[key] instanceof Relationship)) {
            const message = `[${key}] is not a relationship on ${schema.name}`;
            console.warn(message);
        }
        else {
            addToLoads(key, schema._fields[key], load, newLoads);
        }
    }
    return newLoads;
}

class LoadQuery extends ContextualQuery {
    constructor(load) {
        super();
        this.load = load;
        this.whereHasAnds = [];
        this.whereHasOrs = [];
        this.orders = [];
    }
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
    withoutRelationships() {
        if (this.load) {
            this.load.clear();
        }
        return this;
    }
    get() {
        throw new Error('Method not allowed');
    }
    orderBy(...args) {
        switch (args.length) {
            case 2:
                const [key, direction] = args;
                this.orders.push({ key, direction });
                break;
            case 1:
                this.orders.push(...args);
                break;
            default:
                throw new Error('invalid OrderBy Arguments');
        }
        return this;
    }
    apply(items) {
        if (Array.isArray(items)) {
            return this._sort(this._filter(items));
        }
        else if (this.matchesItem(items)) {
            return items;
        }
    }
    _sort(items) {
        if (!(this.orders.length && items.length))
            return [...items];
        const comparator = getSortComparator(this.orders);
        return [...items].sort(comparator);
    }
}

class Load {
    constructor(relationship) {
        this.relationship = relationship;
        this.loads = new Map();
    }
    addLoad(name, load) {
        this.loads.set(name, load);
    }
    getLoad(name) {
        return this.loads.get(name);
    }
    clear() {
        this.loads.clear();
    }
    has(name) {
        return this.loads.has(name);
    }
    apply(data) {
        if (!this.query || data == null)
            return data;
        return this.query.apply(data);
    }
    getRelationship() {
        return this.relationship;
    }
    parse(...args) {
        const rawLoads = this.parseRawLoadArgs(...args);
        Object.entries(rawLoads).forEach(([key, val]) => {
            const segments = key.split('.');
            const loads = segments.reduce((loads, segment) => getLoads(loads, segment), [this]);
            loads.forEach((load) => {
                var _a;
                if (!isFunction(val))
                    return;
                (_a = load.query) !== null && _a !== void 0 ? _a : (load.query = new LoadQuery(load));
                val.call(null, load.query);
            });
        });
        return this;
    }
    parseRawLoadArgs(...args) {
        let rawLoads = createObject();
        const [firstArg, secondArg] = args;
        switch (args.length) {
            case 1:
                if (Array.isArray(firstArg)) {
                    firstArg.forEach((item) => (rawLoads[item] = true));
                }
                else if (isString(firstArg)) {
                    rawLoads[firstArg] = true;
                }
                else {
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

class ItemRelationship extends Relationship {
}

class ModelQuery extends LoadQuery {
    constructor(schema) {
        super(null);
        this.schema = schema;
        this.withArgs = [];
    }
    with(...args) {
        if (this.load)
            return super.with(args[0], args[1]);
        this.withArgs.push(args);
        return this;
    }
    withoutRelationships() {
        this.withArgs = [];
        this.load = new Load(new ItemRelationship(() => this.schema));
        return super.withoutRelationships();
    }
    initLoad() {
        if (!this.load && this.withArgs.length) {
            this.load = new Load(new ItemRelationship(() => this.schema));
            this.withArgs.forEach(([first, second]) => {
                super.with(first, second);
            });
        }
        return this.load;
    }
    get() {
        let items = this.schema.all();
        items = this.apply(items);
        if (this.initLoad()) {
            return items.map((item) => {
                return this.schema.find(getIdValue(item, this.schema), { load: this.load });
            });
        }
        return items;
    }
    first() {
        let items = this.schema.all();
        const first = items.find((item) => this.matchesItem(item));
        if (!first)
            return;
        if (this.initLoad()) {
            return this.schema.find(getIdValue(first, this.schema), { load: this.load });
        }
        return first;
    }
}

class BelongsToRelationship extends Relationship {
    constructor(schemaFactory, parentSchemaFactory, foreignKey) {
        super(schemaFactory, parentSchemaFactory);
        this.foreignKey = foreignKey;
    }
}

function BelongsTo(factory, foreignKey) {
    return (target, propName) => {
        const constructor = target.constructor;
        if (constructor._fields == null) {
            constructor._fields = createObject();
        }
        if (propName in constructor._fields) {
            return;
        }
        constructor._fields[propName] = BelongsTo.define(factory, () => constructor, foreignKey);
    };
}
BelongsTo.define = function (factory, parentFactory, foreignKey) {
    return new BelongsToRelationship(factory, parentFactory, foreignKey);
};

class HasManyRelationship extends ListLike {
    constructor(schemaFactory, parentSchemaFactory, foreignKey) {
        super(schemaFactory, parentSchemaFactory);
        this.foreignKey = foreignKey;
    }
}

function HasMany(factory, foreignKey) {
    return (target, propName) => {
        const constructor = target.constructor;
        if (constructor._fields == null) {
            constructor._fields = createObject();
        }
        if (propName in constructor._fields) {
            return;
        }
        constructor._fields[propName] = HasMany.define(factory, () => constructor, foreignKey);
    };
}
HasMany.define = function (factory, parentFactory, foreignKey) {
    return new HasManyRelationship(factory, parentFactory, foreignKey);
};

class Model {
    constructor(data, opts) {
        /**
         * Indicates wether this model is connected to the store
         */
        this._connected = false;
        const id = data ? getIdValue(data, getConstructor(this)) : null;
        Object.defineProperties(this, {
            _caches: { value: Object.fromEntries(cacheNames.map((name) => [name, {}])) },
            _connected: { value: !!(opts === null || opts === void 0 ? void 0 : opts.connected), enumerable: false, configurable: true },
            _load: { value: opts === null || opts === void 0 ? void 0 : opts.load, enumerable: false, configurable: true },
            _id: { value: id, enumerable: false, configurable: false, writable: true },
        });
        const { _fields } = getConstructor(this);
        for (let key of Object.keys(_fields)) {
            createAccessor(this, key);
        }
        if (!this._connected) {
            cacheDefaults(this, data || {});
            Vue.observable(this._caches);
        }
        // No need for proxy
        // return new Proxy<Model>(this, {
        // set: proxySetter
        // });
    }
    /**
     * Convert to JSON
     * @internal
     */
    toJSON(parentkey, parentNode) {
        const constructor = getConstructor(this);
        const json = {};
        for (let [key, val] of Object.entries(this)) {
            if (key in constructor._fields) {
                if (constructor._fields[key] instanceof Relationship) {
                    const node = { item: this, parentNode };
                    if (val == null) {
                        json[key] = val;
                    }
                    else if (Array.isArray(val)) {
                        let items = [];
                        for (let item of val) {
                            items.push(item.toJSON ? (hasSeen(item, node) ? getRecursionMessage(item) : item.toJSON(key, node)) : item);
                        }
                        json[key] = items;
                    }
                    else {
                        json[key] = val.toJSON ? (hasSeen(val, node) ? getRecursionMessage(val) : val.toJSON(key, node)) : val;
                    }
                }
                else {
                    json[key] = val;
                }
            }
        }
        return json;
    }
    /**
     * Converts the model to a plain javascript object.
     */
    $toObject(allProps = false) {
        return modelToObject(this, getConstructor(this), allProps);
    }
    /**
     * Update the properties of the model with the given data. You don't need to pass the full model.
     * You can pass only the props you want to update, You can also pass related models or model-like data
     */
    async $update(data = {}) {
        const constructor = getConstructor(this);
        return constructor._store
            .dispatch(`${constructor._namespace}/update`, {
            id: this._id,
            data,
            schema: constructor,
        })
            .then((id) => {
            this._connected = true;
            return id;
        });
    }
    /**
     * Useful when a model is created using `new Model()`.
     * You can assign properties to the model like you would any other javascript
     * object but the new values won't be saved to the vuex store until this method is called;
     *
     * If none model-like data has been assigned to the relationships on `this` model, calling save would
     * transform them to actual models
     */
    async $save() {
        return new Promise((resolve) => {
            const constructor = getConstructor(this);
            if (this._connected) {
                console.warn('No need calling $save. This entity is already connected to the Vuex store');
            }
            else {
                const item = cacheNames.reduce((acc, name) => {
                    return { ...acc, ...this._caches[name] };
                }, {});
                resolve(constructor._store
                    .dispatch(`${constructor._namespace}/${Actions.ADD}`, { items: item, schema: constructor })
                    .then((res) => {
                    this._id = res;
                    this._connected = true;
                    return res;
                }));
            }
        });
    }
    /**
     * This is an alternative to the `Field(), List(), Item(), BelongsTo() and HasMany()` decorators.
     *
     * Specify the different fields of the class
     * in an object that contains the field names as it's keys
     * e.g
     * ```javascript
     * class User extends model {
     *   static get fields() {
     *     return {
     *       id: this.$field(),
     *       name: this.$field(),
     *       posts: this.$hasMany(() => Post)
     *     }
     *   }
     * }
     * ```
     * @deprecated
     */
    static get fields() {
        return {};
    }
    /**
     * Find a model by the specified identifier
     */
    static find(id, opts = {}) {
        return this._store.getters[`${this._namespace}/${Getters.FIND}`](id, this, opts);
    }
    /**
     * Find all items that match the specified ids
     *
     */
    static findByIds(ids, opts = {}) {
        return this._store.getters[`${this._namespace}/${Getters.FIND_BY_IDS}`](ids, this, opts);
    }
    /**
     * Get all items of this type from the Database
     */
    static all(opts = {}) {
        return this._store.getters[`${this._namespace}/${Getters.ALL}`](this, opts);
    }
    /**
     * Add the passed item to the database. It should match this model's schema.
     *
     * It returns a promise of the inserted entity's id
     */
    static add(item) {
        return this._store.dispatch(`${this._namespace}/${Actions.ADD}`, { items: item, schema: this });
    }
    /**
     * Add the passed items to the database. It should match this model's schema.
     *
     * It returns a promise of an array of ids for the inserted entities.
     */
    static addAll(items) {
        return this._store.dispatch(`${this._namespace}/${Actions.ADD}`, { items, schema: [this] });
    }
    static $item(factory) {
        return Item.define(factory, () => this);
    }
    static $list(factory) {
        return List.define(factory, () => this);
    }
    static $field(options = {}) {
        return Field.define(options);
    }
    static $belongsTo(factory, foreignKey) {
        return BelongsTo.define(factory, () => this, foreignKey);
    }
    static $hasMany(factory, foreignKey) {
        return HasMany.define(factory, () => this, foreignKey);
    }
    static query(fn) {
        const query = new ModelQuery(this);
        fn && fn(query);
        return query;
    }
}
/**
 * The identifier for the model. It also accepts an id resolver function that
 * receives a model-like param as input and returns the id;
 * @default 'id'
 */
Model.id = 'id';

class ListRelationship extends ListLike {
}

const listLike = (entityDef) => Array.isArray(entityDef) || entityDef instanceof ListLike;
const getRelationshipSchema = (entityDef) => Array.isArray(entityDef)
    ? entityDef[0]
    : entityDef.prototype instanceof Model
        ? entityDef
        : entityDef instanceof Relationship
            ? entityDef.schema
            : null;
function normalize(raw, entityDef, visited = new Map(), entities = new Map(), depth = 0) {
    const schema = getRelationshipSchema(entityDef);
    const fields = schema._fields;
    let result;
    if (raw == null) {
        result = null;
    }
    else if (Array.isArray(raw) && listLike(entityDef)) {
        result = raw
            .map((r) => {
            const { result } = normalize(r, schema, visited, entities, depth + 1);
            return result;
        })
            .filter((id) => id != null);
    }
    else {
        if (visited.has(raw)) {
            result = visited.get(raw);
        }
        else {
            result = getIdValue(raw, schema);
            visited.set(raw, result);
            if (!entities.has(schema)) {
                entities.set(schema, createObject());
            }
            if (!entities.get(schema)[result]) {
                entities.get(schema)[result] = {};
            }
            let normalized = entities.get(schema)[result];
            let relEntries = [];
            let fieldEntries = [];
            let relatedResults = [];
            for (let [key, value] of Object.entries(raw)) {
                if (!(key in fields))
                    continue;
                (fields[key] instanceof Relationship ? relEntries : fieldEntries).push([key, value]);
            }
            for (let [key, value] of relEntries) {
                const relationship = fields[key];
                const { result: relatedResult } = normalize(value, relationship, visited, entities, depth + 1);
                relatedResults.push({ key, value: relatedResult, relationship });
            }
            for (let [key, value] of fieldEntries) {
                normalized[key] = value;
            }
            for (let { key, value, relationship } of relatedResults) {
                switch (true) {
                    case relationship instanceof ItemRelationship:
                    case relationship instanceof ListRelationship: {
                        normalized[key] = value;
                        break;
                    }
                    case relationship instanceof HasManyRelationship: {
                        if (value == null)
                            continue;
                        const { schema, foreignKey } = relationship;
                        for (let id of value) {
                            entities.get(schema)[id][foreignKey] = result;
                        }
                        break;
                    }
                    case relationship instanceof BelongsToRelationship: {
                        const { foreignKey } = relationship;
                        normalized[foreignKey] = value;
                        break;
                    }
                }
            }
        }
    }
    return {
        result,
        entities,
    };
}

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function validateItems(items, schema) {
    for (const item of items) {
        if (getIdValue(item, schema) == null) {
            throw new Error(`An item being assigned to this array does not have a valid identifier`);
        }
    }
}
function validate() {
    return (target, key, descriptor) => {
        const method = descriptor.value;
        descriptor.value = function (...args) {
            const { _schema } = this;
            validateItems(args, _schema);
            method.apply(this, args);
        };
    };
}
function validateSplice() {
    return (target, key, descriptor) => {
        const method = descriptor.value;
        descriptor.value = function (...args) {
            const { _schema } = this;
            let [, , ...items] = args;
            items.length && validateItems(items, _schema);
            method.apply(this, args);
        };
    };
}
class ModelArray extends Array {
    constructor(...args) {
        super(...args);
        Object.setPrototypeOf(this, ModelArray.prototype);
    }
    _init(context, key, items) {
        Object.defineProperties(this, {
            _context: { value: context },
            _key: { value: key },
            _store: { value: getConstructor(context)._store },
            _contextSchema: { value: getConstructor(context) },
            _schema: { value: getConstructor(context)._fields[key].schema },
        });
        super.push.apply(this, items);
        return this;
    }
    push(...items) {
        normalizeAndStore(this._store, { ...this._context, [this._key]: [...this._allForContext(), ...items] }, this._contextSchema);
        super.splice(0, this.length, ...this._context[this._key]);
        return this.length;
    }
    pop() {
        const removed = super.pop();
        this._remove([removed]);
        return removed;
    }
    unshift(...items) {
        normalizeAndStore(this._store, { ...this._context, [this._key]: [...this._allForContext(), ...items] }, this._contextSchema);
        super.splice(0, this.length, ...this._context[this._key]);
        return this.length;
    }
    shift() {
        const removed = super.shift();
        this._remove([removed]);
        return removed;
    }
    splice(...args) {
        const [start, count, ...rest] = args;
        let result = args.length === 0 ? [] : super.splice(start, count, ...rest);
        this._remove(result);
        normalizeAndStore(this._store, { ...this._context, [this._key]: [...this._allForContext(), ...rest] }, this._contextSchema);
        return result;
    }
    toPlainArray() {
        return [...this].map((item) => (item instanceof Model ? item.$toObject() : item));
    }
    _remove(items) {
        if (!items.length)
            return;
        const { _schema: schema, _contextSchema: { _fields: { [this._key]: relationship }, }, } = this;
        const allItems = this._allForContext();
        const itemIds = items.map((item) => getIdValue(item, schema));
        switch (true) {
            case relationship instanceof ListRelationship: {
                const idsRemaining = allItems.map((item) => getIdValue(item, schema)).filter((id) => !itemIds.includes(id));
                this._mutateContext(idsRemaining);
                break;
            }
            case relationship instanceof HasManyRelationship: {
                schema
                    .findByIds(itemIds)
                    .forEach((item) => (item[relationship.foreignKey] = null));
                break;
            }
        }
    }
    _allForContext() {
        var _a;
        return ((_a = this._contextSchema.find(this._context._id)) === null || _a === void 0 ? void 0 : _a[this._key]) || [];
    }
    _mutateContext(value) {
        this._store.commit(`${this._contextSchema._namespace}/${Mutations.SET_PROP}`, {
            id: this._context._id,
            key: this._key,
            value,
            schema: this._contextSchema,
        });
    }
}
__decorate([
    validate()
], ModelArray.prototype, "push", null);
__decorate([
    validate()
], ModelArray.prototype, "unshift", null);
__decorate([
    validateSplice()
], ModelArray.prototype, "splice", null);
window.ModelArray = ModelArray;

function getConstructor(model) {
    return model.constructor;
}
const cacheNames = ['data', 'relationship'];
const getCacheName = (isRelationship) => cacheNames[isRelationship ? 1 : 0];
const parseIfLiteral = (id, schema) => {
    return ['string', 'number'].includes(typeof id) ? schema.find(id) : id;
};
function cacheDefaults(model, overrides = {}) {
    Object.entries(getConstructor(model)._fields).forEach(([key, definition]) => {
        var _a;
        model._caches[getCacheName(definition instanceof Relationship)][key] = (_a = overrides[key]) !== null && _a !== void 0 ? _a : definition.default;
    });
}
function persistUnconnected(target, key, value, relationship) {
    if (relationship) {
        const Related = relationship.schema;
        value = parseIfLiteral(value, Related);
        if (relationship instanceof ListLike && value != null) {
            value = Array.isArray(value) ? value : [value].filter(identity);
        }
    }
    Vue.set(target._caches[getCacheName(!!relationship)], key, value);
}
function persistConnected(target, key, value, relationship, schema) {
    const { _store: store, _namespace: path, id } = schema;
    if (relationship) {
        const Related = relationship.schema;
        value = parseIfLiteral(value, Related);
        if (relationship instanceof ListLike && value != null) {
            value = Array.isArray(value) ? value : [value].filter(identity);
        }
        if (value != null) {
            if (!validateEntry(value, relationship)) {
                throw new Error(`An item being assigned to the property [${key}] does not have a valid identifier`);
            }
        }
        normalizeAndStore(store, { ...target, [key]: value }, schema);
    }
    else {
        if (isFunction(id) || id == key) {
            const oldId = getIdValue(target, schema);
            const newId = getIdValue({ ...target, [key]: value }, schema);
            if (oldId != newId) {
                throw new Error('This update is not allowed because the resolved id is different from the original value');
            }
        }
        store.commit(`${path}/${Mutations.SET_PROP}`, { id: target._id, key, value, schema });
    }
}
function createAccessor(target, key) {
    const schema = getConstructor(target);
    const { _namespace: path, _store, _fields } = schema;
    const isRelationship = _fields[key] instanceof Relationship;
    const relationshipDef = isRelationship ? _fields[key] : null;
    const load = target._load;
    Object.defineProperty(target, key, {
        enumerable: load && isRelationship ? load.has(key) : true,
        get() {
            if (target._connected) {
                if (load && isRelationship && !load.has(key))
                    return;
                const raw = _store.getters[`${path}/${Getters.GET_RAW}`](target._id, schema);
                let value = raw[key];
                if (isRelationship) {
                    const opts = { load: load === null || load === void 0 ? void 0 : load.getLoad(key) };
                    const Related = relationshipDef.schema;
                    if (relationshipDef instanceof ListLike) {
                        if (relationshipDef instanceof HasManyRelationship) {
                            // Todo: index and Cache relationship keys
                            value = schema.index.get(relationshipDef, this._id);
                            // .all(opts)
                            // .filter((item) => item[relationshipDef.foreignKey] == this._id)
                            // .map((item) => getIdValue(item, relationshipDef.schema));
                        }
                        if (value) {
                            value = Related.findByIds(value, opts);
                            if (opts.load) {
                                value = opts.load.apply(value);
                            }
                            return value && new ModelArray()._init(target, key, value);
                        }
                        return;
                    }
                    else if (relationshipDef instanceof BelongsToRelationship) {
                        if (!(raw === null || raw === void 0 ? void 0 : raw[relationshipDef.foreignKey]))
                            return;
                        value = raw[relationshipDef.foreignKey];
                    }
                    value = Related.find(value, opts);
                    return opts.load ? opts.load.apply(value) : value;
                }
                else {
                    return raw[key];
                }
            }
            return target._caches[getCacheName(isRelationship)][key];
        },
        set(value) {
            target._connected
                ? persistConnected(target, key, value, relationshipDef, schema)
                : persistUnconnected(target, key, value, relationshipDef);
        },
    });
}
function getIdValue(model, schema) {
    return isFunction(schema.id) ? schema.id(model, null, null) : model[schema.id];
}
function validateEntry(data, relationship) {
    const schema = relationship.schema;
    return relationship instanceof ListLike
        ? data.every((item) => getIdValue(item, schema) != null)
        : getIdValue(data, schema) != null;
}
function normalizeAndStore(store, data, entityDef) {
    const { entities, result } = normalize(data, entityDef);
    for (const [schema, items] of entities.entries()) {
        store.commit(`${schema._namespace}/${Mutations.ADD_ALL}`, { schema, items }, { root: true });
    }
    return result;
}
function modelToObject(model, schema, allProps, seen = new Map()) {
    const object = {};
    seen.set(model, object);
    Object.entries(model).reduce((acc, [key, value]) => {
        if (key in schema._fields) {
            const fieldDef = schema._fields[key];
            if (fieldDef instanceof Relationship) {
                const relatedSchema = fieldDef.schema;
                if (value == null) {
                    acc[key] = null;
                }
                else if (Array.isArray(value) && fieldDef instanceof ListLike) {
                    let items = [];
                    for (const item of value) {
                        items.push(seen.has(item) ? seen.get(item) : modelToObject(item, relatedSchema, allProps, seen));
                    }
                    acc[key] = items;
                }
                else {
                    acc[key] = seen.has(value) ? seen.get(value) : modelToObject(value, relatedSchema, allProps, seen);
                }
            }
            else {
                acc[key] = value;
            }
        }
        return acc;
    }, object);
    return object;
}
function getRecursionMessage(item) {
    let message = '>>> Recursive item ';
    if (item instanceof Model) {
        message += `[${item.constructor.name}: ${item._id}] `;
    }
    return message + '<<<';
}

function createModule(store, schemas, index) {
    return {
        namespaced: true,
        state: () => {
            return {
                indices: index.toObject(),
                data: [...new Set(schemas.map((schema) => schema.entityName))].reduce((state, name) => {
                    state[name] = {};
                    return state;
                }, {}),
            };
        },
        mutations: {
            [Mutations.ADD_ALL](state, { items, schema }) {
                const storeName = schema.entityName;
                state.data[storeName] = {
                    ...state.data[storeName],
                    ...Object.fromEntries(Object.entries(items).map(([id, entity]) => {
                        return [
                            id,
                            {
                                ...state.data[storeName][id],
                                ...entity,
                            },
                        ];
                    })),
                };
            },
            [Mutations.SET_PROP](state, { id, key, value, schema }) {
                if (state.data[schema.entityName][id] == null) {
                    throw new Error('Entity does not exist');
                }
                Vue.set(state.data[schema.entityName][id], key, value);
            },
            [Mutations.SET_INDEX](state, { indexName, data }) {
                Vue.set(state.indices, indexName, data);
            },
        },
        actions: {
            [Actions.ADD](ctx, { items, schema }) {
                return normalizeAndStore(store, items, schema);
            },
            [Actions.UPDATE]({ getters, dispatch }, { id, data, schema }) {
                if (id === null || id === undefined) {
                    throw new Error('Id to perform update must be defined');
                }
                const ids = Array.isArray(id) ? id : [id];
                const items = getters[Getters.FIND_BY_IDS](ids, schema).filter(identity);
                if (items.length !== ids.length) {
                    throw new Error('Invalid item to update');
                }
                let newItems;
                if (isFunction(schema.id)) {
                    // if the id definition on the model is a function, it means
                    // the value is computed. We don't want an update to change the id
                    // otherwise it'll break consistency
                    newItems = items.map((item) => ({ ...item, ...data }));
                    const oldIds = items.map((item) => getIdValue(item, schema));
                    const newIds = newItems.map((item) => getIdValue(item, schema));
                    const idHasChanged = oldIds.some((id, index) => id != newIds[index]);
                    if (idHasChanged) {
                        throw new Error('Invalid Update: This would cause a change in the computed id.');
                    }
                }
                else {
                    const idName = schema.id;
                    newItems = items.map((item) => ({
                        ...(isFunction(schema.id) ? item : null),
                        ...data,
                        [idName]: id,
                    }));
                }
                return dispatch(Actions.ADD, { items: newItems, schema: [schema] });
            },
        },
        getters: {
            [Getters.GET_RAW]: (state) => (id, schema) => state.data[schema.entityName][id],
            [Getters.GET_INDEX]: (state) => (schema, path, id) => { var _a; return ((_a = state.indices[schema.entityName][path]) === null || _a === void 0 ? void 0 : _a[id]) || []; },
            [Getters.FIND]: (_, getters) => (id, schema, opts = {}) => {
                const data = getters[Getters.GET_RAW](id, schema);
                if (!data) {
                    return;
                }
                let load;
                if (opts.load) {
                    load = !(opts.load instanceof Load)
                        ? new Load(new ItemRelationship(() => schema)).parse(opts.load)
                        : opts.load;
                }
                return resolveModel(schema, data, { load, connected: true });
            },
            [Getters.FIND_BY_IDS]: (_, getters) => {
                return function (ids = [], schema, opts = {}) {
                    return ids.map((id) => getters[Getters.FIND](id, schema, opts)).filter(identity);
                };
            },
            [Getters.ALL]: (state, getters) => (schema, opts = {}) => {
                return getters[Getters.FIND_BY_IDS](Object.keys(state.data[schema.entityName]), schema, opts);
            },
        },
    };
}
const modelCache = new Map();
function resolveModel(schema, rawData, options = {}) {
    var _a;
    const id = getIdValue(rawData, schema);
    if (!options.load) {
        if (!modelCache.has(schema)) {
            modelCache.set(schema, createObject());
        }
        const cache = modelCache.get(schema);
        return ((_a = cache[id]) !== null && _a !== void 0 ? _a : (cache[id] = new schema(rawData, options)));
    }
    else
        return new schema(rawData, options);
}
window.modelCache = modelCache;

function Field(options = {}) {
    return (target, propName) => {
        const constructor = target.constructor;
        if (constructor._fields == null) {
            constructor._fields = createObject();
        }
        if (propName in constructor._fields) {
            return;
        }
        constructor._fields[propName] = Field.define(options);
    };
}
Field.define = function (options = {}) {
    return new SimpleFieldDefinition(options);
};

function Item(factory) {
    return (target, propName) => {
        const constructor = target.constructor;
        if (constructor._fields == null) {
            constructor._fields = createObject();
        }
        if (propName in constructor._fields) {
            return;
        }
        constructor._fields[propName] = Item.define(factory, () => constructor);
    };
}
Item.define = function (factory, parentFactory) {
    return new ItemRelationship(factory, parentFactory);
};

function List(factory) {
    return (target, propName, other) => {
        const constructor = target.constructor;
        if (constructor._fields == null) {
            constructor._fields = createObject();
        }
        if (propName in constructor._fields) {
            return;
        }
        constructor._fields[propName] = List.define(factory, () => constructor);
    };
}
List.define = function (factory, parentFactory) {
    return new ListRelationship(factory);
};

class Watcher {
    constructor(schema, store, namespace, name) {
        this.schema = schema;
        this.store = store;
        this.namespace = namespace;
        this.name = name;
        this.interests = new Set();
    }
    addRelationship(relationship) {
        if (relationship.schema != this.schema) {
            throw new Error('This relationship is not indexable on this watcher');
        }
        this.interests.add(relationship);
    }
    registerWatcher() {
        this.unwatch && this.unwatch();
        const concerns = [...this.interests.values()].map((rel) => [rel.parentSchema.entityName, rel.foreignKey]);
        this.unwatch = this.store.watch((state) => {
            const index = concerns.reduce((obj, [entityName]) => {
                obj[entityName] = createObject();
                return obj;
            }, createObject());
            const entries = Object.entries(state[this.namespace].data[this.schema.entityName]);
            for (let [relatedId, value] of entries) {
                for (let [entityName, foreignKey] of concerns) {
                    if (value[foreignKey] == null)
                        continue;
                    if (!index[entityName][value[foreignKey]]) {
                        index[entityName][value[foreignKey]] = [];
                    }
                    index[entityName][value[foreignKey]].push(relatedId);
                }
            }
            return index;
        }, (data) => this.store.commit(`${this.namespace}/${Mutations.SET_INDEX}`, { indexName: this.name, data }));
    }
}

class Index {
    constructor(store, namespace) {
        this.store = store;
        this.namespace = namespace;
        this.map = new Map();
    }
    addIndex(relationship) {
        let watcher;
        let { schema } = relationship;
        if (!this.map.has(schema)) {
            watcher = new Watcher(schema, this.store, this.namespace, schema.entityName);
            this.map.set(schema, watcher);
        }
        else {
            watcher = this.map.get(schema);
        }
        watcher.addRelationship(relationship);
    }
    toObject() {
        const result = createObject();
        for (let [schema, watcher] of this.map) {
            result[schema.entityName] = createObject();
            for (let relationship of watcher.interests) {
                result[schema.entityName][relationship.parentSchema.entityName] = createObject();
            }
        }
        return result;
    }
    init() {
        for (let watcher of this.map.values()) {
            watcher.registerWatcher();
        }
    }
    get({ schema, parentSchema }, parentId) {
        return this.store.getters[`${this.namespace}/${Getters.GET_INDEX}`](schema, parentSchema.entityName, parentId);
    }
}

const defaultPluginOptions = {
    schemas: [],
    namespace: 'database',
};
function generateDatabasePlugin(options) {
    const { schemas, namespace } = { ...defaultPluginOptions, ...options };
    return (store) => {
        const index = new Index(store, namespace);
        Object.defineProperty(Model, 'index', {
            value: index,
        });
        schemas.forEach((schema) => {
            registerSchema(schema, store, namespace);
            Object.values(schema._fields).forEach((definition) => {
                if (definition instanceof HasManyRelationship)
                    index.addIndex(definition);
            });
        });
        store.registerModule(namespace, createModule(store, schemas, index));
        index.init();
    };
}

export { BelongsTo, Field, HasMany, Item, List, Model, generateDatabasePlugin };
//# sourceMappingURL=vuex-rdb.es.js.map
