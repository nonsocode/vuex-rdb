import Vue from 'vue';

const identity = (k) => k;
function mergeUnique(items, key) {
    const keyFunction = isFunction(key) ? key : (item) => item[key];
    const map = new Map();
    items.forEach((item) => {
        const key = keyFunction.call(null, item);
        map.set(key, map.has(key) ? { ...map.get(key), ...item } : item);
    });
    return [...map.values()];
}
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
    object &&
        Object.entries(object).forEach(([key, value]) => {
            o[key] = value;
        });
    return o;
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
    if (!store.state[namespace][schema.entityName]) {
        Vue.set(store.state[namespace], schema.entityName, {});
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
})(Getters || (Getters = {}));

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
class Rel extends FieldDefinition {
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
class ListLike extends Rel {
}

const listLike = (entityDef) => Array.isArray(entityDef) || entityDef instanceof ListLike;
const getRelationshipSchema = (entityDef) => Array.isArray(entityDef)
    ? entityDef[0]
    : entityDef.prototype instanceof Model
        ? entityDef
        : entityDef instanceof Rel
            ? entityDef.schema
            : null;
function normalize(raw, entityDef, visited = new Map(), entities = new Map(), depth = 0) {
    const schema = getRelationshipSchema(entityDef);
    const fields = schema._fields;
    let normalized = {};
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
            const id = getIdValue(raw, schema);
            result = id;
            visited.set(raw, id);
            for (let [key, value] of Object.entries(raw)) {
                if (key in fields) {
                    normalized[key] =
                        fields[key] instanceof Rel
                            ? normalize(value, fields[key], visited, entities, depth + 1).result
                            : value;
                }
            }
            if (!entities.has(schema)) {
                entities.set(schema, createObject());
            }
            entities.get(schema)[id] = { ...entities.get(schema)[id], ...normalized };
        }
    }
    return {
        result,
        entities,
    };
}

function getConstructor(model) {
    return model.constructor;
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
            if (fieldDef instanceof Rel) {
                const relatedSchema = fieldDef.schema;
                if (value == null) {
                    acc[key] = null;
                }
                else if (Array.isArray(value) && fieldDef instanceof ListLike) {
                    acc[key] = value.map((item) => seen.has(item) ? seen.get(item) : modelToObject(item, relatedSchema, allProps, seen));
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
            const { schema } = this._extractUtils();
            validateItems(args, schema);
            method.apply(this, args);
        };
    };
}
function validateSplice() {
    return (target, key, descriptor) => {
        const method = descriptor.value;
        descriptor.value = function (...args) {
            const { schema } = this._extractUtils();
            let [, , ...items] = args;
            items.length && validateItems(items, schema);
            method.apply(this, args);
        };
    };
}
class ModelArray extends Array {
    constructor(context, key, items) {
        super();
        Object.defineProperties(this, {
            _context: { value: context },
            _key: { value: key },
            _store: { value: getConstructor(context)._store },
        });
        super.push.apply(this, items);
        Object.setPrototypeOf(this, ModelArray.prototype);
    }
    push(...items) {
        var _a;
        const { schema, rawContext } = this._extractUtils(true);
        const referenceArray = rawContext[this._key] || [];
        items.forEach((item) => normalizeAndStore(this._store, item, schema));
        const ids = items.map((item) => getIdValue(item, schema));
        this._mutateContext([...referenceArray, ...ids]);
        super.push(...schema.findByIds(ids, { load: (_a = this._context._load) === null || _a === void 0 ? void 0 : _a[this._key] }));
        return this.length;
    }
    pop() {
        const { schema } = this._extractUtils();
        const removed = super.pop();
        this._mutateContext(this.map((item) => getIdValue(item, schema)));
        return removed;
    }
    unshift(...items) {
        var _a;
        const { schema, rawContext } = this._extractUtils(true);
        const referenceArray = rawContext[this._key] || [];
        items.forEach((item) => normalizeAndStore(this._store, item, schema));
        const ids = items.map((item) => getIdValue(item, schema));
        this._mutateContext([...ids, ...referenceArray]);
        super.unshift(...schema.findByIds(ids, { load: (_a = this._context._load) === null || _a === void 0 ? void 0 : _a[this._key] }));
        return this.length;
    }
    shift() {
        const { schema } = this._extractUtils();
        const removed = super.shift();
        this._mutateContext(this.map((item) => getIdValue(item, schema)));
        return removed;
    }
    splice(...args) {
        const [start, count, ...rest] = args;
        const { schema } = this._extractUtils();
        let result;
        rest.forEach((item) => normalizeAndStore(this._store, item, schema));
        result = args.length === 0 ? [] : super.splice(start, count, ...rest);
        this._mutateContext(this.map((item) => getIdValue(item, schema)));
        return result;
    }
    _mutateContext(value) {
        const { contextSchema: schema } = this._extractUtils();
        this._store.commit(`${schema._namespace}/${Mutations.SET_PROP}`, {
            id: this._context._id,
            key: this._key,
            value,
            schema,
        });
    }
    _extractUtils(withRawData = false) {
        const contextSchema = getConstructor(this._context);
        const schema = contextSchema._fields[this._key].schema;
        const rawContext = withRawData
            ? this._store.getters[`${contextSchema._namespace}/${Getters.GET_RAW}`](getIdValue(this._context, contextSchema), contextSchema)
            : null;
        return {
            contextSchema,
            rawContext,
            schema,
        };
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
    matchItem(item) {
        if (!this.whereAnds.length && !this.whereOrs.length)
            return true;
        const result = [];
        const comparator = getComparator(item);
        result.push(!!(this.whereAnds.length && this.whereAnds.every(comparator)));
        result.push(!!(this.whereOrs.length && this.whereOrs.some(comparator)));
        return result.some(identity);
    }
    get() {
        return this.matchItem(this.context);
    }
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
        const query = new ContextualQuery(value);
        const result = where.value.call(null, query, value);
        if (typeof result == 'boolean')
            return result;
        return query.get();
    }
    else if (isBoolean(where.operand)) {
        return where.operand;
    }
    else if (isString(where.key) && !isFunction(where.value)) {
        let resolved = get(where.key, item);
        const isArray = Array.isArray(resolved);
        resolved = isArray ? resolved.length : resolved;
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
            case '=':
            default:
                return resolved == where.value;
        }
    }
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
                .filter(([, fieldDef]) => fieldDef instanceof Rel)
                .forEach(([key, value]) => {
                addToLoads(key, value, load, newLoads);
            });
        }
        else if (!schema._fields[key] || !(schema._fields[key] instanceof Rel)) {
            console.warn(`[${key}] is not a relationship`);
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
    get() {
        throw new Error('Method not implemented.');
    }
}

class Load {
    constructor(relationship) {
        this.relationship = relationship;
        this.loads = new Map();
        this.conditions = new Set();
    }
    addLoad(name, load) {
        this.loads.set(name, load);
    }
    getLoad(name) {
        return this.loads.get(name);
    }
    has(name) {
        return this.loads.has(name);
    }
    addCondition(where) {
        this.conditions.add(where);
    }
    apply(data) {
        if (this.conditions.size == 0 || data == null)
            return data;
        const conditions = [...this.conditions];
        if (this.relationship instanceof ListLike) {
            return data.filter((item) => {
                return conditions.some((condition) => condition.matchItem(item));
            });
        }
        else if (conditions.some((condition) => condition.matchItem(data))) {
            return data;
        }
    }
    getRelationship() {
        return this.relationship;
    }
    parse(...args) {
        const rawLoads = this.parseRawLoadArgs(...args);
        Object.entries(rawLoads).forEach(([key, val]) => {
            const segments = key.split('.'); // [user, posts, *, issues, comments]
            const loads = segments.reduce((loads, segment) => getLoads(loads, segment), [this]);
            loads.forEach((load) => {
                if (isFunction(val)) {
                    const query = new LoadQuery(load);
                    val.call(null, query);
                    load.addCondition(query);
                }
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
                else if (isString) {
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

class ItemRelationship extends Rel {
}

class ModelQuery extends LoadQuery {
    constructor(schema) {
        super(null);
        this.schema = schema;
        this.withArgs = [];
    }
    with(...args) {
        this.withArgs.push(args);
        return this;
    }
    initLoad() {
        if (!this.load) {
            this.load = new Load(new ItemRelationship(() => this.schema));
        }
        return this.load;
    }
    get() {
        let items = this.schema.all();
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

const cacheNames = ['data', 'relationship'];
const getCacheName = (isRelationship) => cacheNames[isRelationship ? 1 : 0];
const parseIfLiteral = (id, schema) => {
    return ['string', 'number'].includes(typeof id) ? schema.find(id) : id;
};
function cacheDefaults(model, overrides = {}) {
    Object.entries(getConstructor(model)._fields).forEach(([key, definition]) => {
        var _a;
        model._caches[getCacheName(definition instanceof Rel)][key] = (_a = overrides[key]) !== null && _a !== void 0 ? _a : definition.default;
    });
}
function createAccessor(target, key) {
    const schema = getConstructor(target);
    const { _namespace: path, _store, _fields, id } = schema;
    const isRelationship = _fields[key] instanceof Rel;
    const relationshipDef = isRelationship ? _fields[key] : null;
    const load = target._load;
    Object.defineProperty(target, key, {
        enumerable: load && isRelationship ? load.has(key) : true,
        get() {
            if (target._connected) {
                if (load && isRelationship && !load.has(key))
                    return;
                const raw = _store.getters[`${path}/${Getters.GET_RAW}`](this._id, schema);
                let value = raw[key];
                if (isRelationship) {
                    const opts = { load: load === null || load === void 0 ? void 0 : load.getLoad(key) };
                    const Related = relationshipDef.schema;
                    if (relationshipDef instanceof ListLike) {
                        if (value) {
                            value = Related.findByIds(value, opts);
                            if (opts.load) {
                                value = opts.load.apply(value);
                            }
                            return value && new ModelArray(target, key, value);
                        }
                        return;
                    }
                    value = Related.find(value, opts);
                    return opts.load ? opts.load.apply(value) : value;
                }
                else {
                    return raw[key];
                }
            }
            return this._caches[getCacheName(isRelationship)][key];
        },
        set(value) {
            if (value != null) {
                if (isRelationship) {
                    const Related = relationshipDef.schema;
                    value = parseIfLiteral(value, Related);
                    if (relationshipDef instanceof ListLike) {
                        value = Array.isArray(value) ? value : [value].filter(identity);
                    }
                    if (target._connected) {
                        if (!validateEntry(value, relationshipDef)) {
                            throw new Error(`An item being assigned to the property [${key}] does not have a valid identifier`);
                        }
                        value = normalizeAndStore(_store, value, relationshipDef);
                    }
                }
                else if (target._connected && (isFunction(id) || id == key)) {
                    const oldId = getIdValue(target, schema);
                    const newId = getIdValue({ ...target, [key]: value }, schema);
                    if (oldId != newId) {
                        throw new Error('This update is not allowed becasue the resolved id is different from the orginal value');
                    }
                }
            }
            target._connected
                ? _store.commit(`${path}/${Mutations.SET_PROP}`, { id: this._id, key, value, schema })
                : Vue.set(this._caches[getCacheName(isRelationship)], key, value);
        },
    });
}
function getIdValue(model, schema) {
    return isFunction(schema.id) ? schema.id(model, null, null) : model[schema.id];
}
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
        Object.keys(_fields).forEach((key) => {
            createAccessor(this, key);
        });
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
        return Object.entries(this).reduce((acc, [key, val]) => {
            if (key in constructor._fields) {
                if (constructor._fields[key] instanceof Rel) {
                    const node = { item: this, parentNode };
                    if (val == null) {
                        acc[key] = val;
                    }
                    else if (Array.isArray(val)) {
                        acc[key] = val.map((item) => item.toJSON ? (hasSeen(item, node) ? '>>> Recursive item <<<' : item.toJSON(key, node)) : item);
                    }
                    else {
                        acc[key] = val.toJSON ? (hasSeen(val, node) ? '>>> Recursive item <<<' : val.toJSON(key, node)) : val;
                    }
                }
                else {
                    acc[key] = val;
                }
            }
            return acc;
        }, {});
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
                console.warn('No need calling $save');
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
    async $addRelated(related, data) {
        const constructor = getConstructor(this);
        return constructor._store.dispatch(`${constructor._namespace}/${Actions.ADD_RELATED}`, {
            id: this._id,
            related,
            data,
            schema: constructor,
        });
    }
    async $removeRelated(related, relatedId) {
        const constructor = getConstructor(this);
        return constructor._store.dispatch(`${constructor._namespace}/${Actions.REMOVE_RELATED}`, {
            id: this._id,
            related,
            relatedId,
            schema: constructor,
        });
    }
    /**
     * This is an alternative to the `Field()` decorator.
     *
     * Specify the different fields of the class
     * in an array or an object that contains the field names as it's keys
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

function createModule(store, schemas) {
    return {
        namespaced: true,
        state: () => {
            return [...new Set(schemas.map((schema) => schema.entityName))].reduce((state, name) => {
                state[name] = {};
                return state;
            }, {});
        },
        mutations: {
            [Mutations.ADD_ALL](state, { items, schema }) {
                const storeName = schema.entityName;
                state[storeName] = {
                    ...state[storeName],
                    ...Object.fromEntries(Object.entries(items).map(([id, entity]) => {
                        return [
                            id,
                            {
                                ...state[storeName][id],
                                ...entity,
                            },
                        ];
                    })),
                };
            },
            [Mutations.SET_PROP](state, { id, key, value, schema }) {
                if (state[schema.entityName][id] == null) {
                    throw new Error('Entity does not exist');
                }
                Vue.set(state[schema.entityName][id], key, value);
            },
        },
        actions: {
            [Actions.ADD](ctx, { items, schema }) {
                return normalizeAndStore(store, items, schema);
            },
            [Actions.ADD_RELATED]({ dispatch, getters }, { id, related, data, schema }) {
                if (!(related in schema._fields && schema._fields[related] instanceof Rel)) {
                    throw new Error(`Unknown Relationship: [${related}]`);
                }
                const item = getters[Getters.FIND](id, schema);
                if (!item) {
                    throw new Error("The item doesn't exist");
                }
                const relationshipDef = schema._fields[related];
                if (relationshipDef instanceof ListLike) {
                    const items = (Array.isArray(data) ? data : [data]).filter(identity);
                    data = item[related] || [];
                    data = mergeUnique(data.concat(items), (item) => getIdValue(item, relationshipDef.schema));
                }
                return dispatch(Actions.UPDATE, {
                    id,
                    data: {
                        [related]: data,
                    },
                    schema,
                });
            },
            [Actions.REMOVE_RELATED]({ dispatch, getters }, { id, related, relatedId, schema }) {
                if (!(related in schema._fields && schema._fields[related] instanceof Rel)) {
                    throw new Error(`Unknown Relationship: [${related}]`);
                }
                const ids = Array.isArray(id) ? id : [id];
                const items = getters[Getters.FIND_BY_IDS](ids, schema);
                if (items.length === 0) {
                    console.warn('Invalid id Provided');
                    return;
                }
                const relationshipDef = schema._fields[related];
                const relatedSchema = relationshipDef.schema;
                if (relationshipDef instanceof ListLike) {
                    const relatedIds = relatedId ? (Array.isArray(relatedId) ? relatedId : [relatedId]) : [];
                    return Promise.all(items.map((item) => {
                        const relatedItems = relatedIds.length ? item[related] || [] : [];
                        return dispatch(Actions.UPDATE, {
                            id,
                            data: {
                                [related]: relatedItems.filter((item) => !relatedIds.includes(getIdValue(item, relatedSchema))),
                            },
                            schema,
                        });
                    }));
                }
                else {
                    return dispatch(Actions.UPDATE, {
                        id,
                        data: {
                            [related]: null,
                        },
                        schema,
                    });
                }
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
            [Getters.GET_RAW]: (state) => (id, schema) => state[schema.entityName][id],
            [Getters.FIND]: (state, getters) => (id, schema, opts = {}) => {
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
            [Getters.FIND_BY_IDS]: (state, getters) => {
                return function (ids = [], schema, opts = {}) {
                    return ids.map((id) => getters[Getters.FIND](id, schema, opts)).filter(identity);
                };
            },
            [Getters.ALL]: (state, getters) => (schema, opts = {}) => {
                return getters[Getters.FIND_BY_IDS](Object.keys(state[schema.entityName]), schema, opts);
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

class ListRelationship extends ListLike {
}

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

const defaultPluginOptions = {
    schemas: [],
    namespace: 'database',
};
function generateDatabasePlugin(options) {
    const { schemas, namespace } = { ...defaultPluginOptions, ...options };
    return (store) => {
        store.registerModule(namespace, createModule(store, schemas));
        schemas.forEach((schema) => {
            registerSchema(schema, store, namespace);
        });
    };
}

export { Field, Item, List, Model, generateDatabasePlugin };
//# sourceMappingURL=vuex-rdb.es.js.map
