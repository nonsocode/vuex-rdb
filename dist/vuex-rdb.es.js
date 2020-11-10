import Vue from 'vue';

const identity = k => k;
function mergeUnique(items, key) {
    const keyFunction = isFunction(key) ? key : item => item[key];
    const map = new Map();
    items.forEach(item => {
        const key = keyFunction.call(null, item);
        map.set(key, map.has(key) ? Object.assign(Object.assign({}, map.get(key)), item) : item);
    });
    return [...map.values()];
}
function isFunction(fn) {
    return fn instanceof Function;
}
function isString(string) {
    return typeof string === 'string';
}
function createObject(object) {
    const o = Object.create(null);
    object && Object.entries(object).forEach(([key, value]) => {
        o[key] = value;
    });
    return o;
}
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
        this._entity = options.entity;
        this._default = options.default;
    }
    get default() {
        return isFunction(this._default) ? this._default() : this._default;
    }
    get isRelationship() {
        return this.entity != null;
    }
    get entity() {
        var _a;
        return (_a = this._entity) === null || _a === void 0 ? void 0 : _a.call(this);
    }
    get isList() {
        if (this._list != null) {
            return this._list;
        }
        return this._list = Array.isArray(this.entity);
    }
}

function registerSchema(schema, store, namespace) {
    if (!schema._fields) {
        schema._fields = createObject();
    }
    if (!store.state[namespace][schema.entityName]) {
        Vue.set(store.state[namespace], schema.entityName, {});
    }
    if (typeof schema.id == 'string' && !(schema.id in schema._fields)) {
        schema._fields[schema.id] = new FieldDefinition();
    }
    Object.entries(schema.relationships || {}).forEach(([key, value]) => {
        if (key in schema._fields)
            return;
        schema._fields[key] = new FieldDefinition({
            entity: () => value
        });
    });
    (Array.isArray(schema.fields) ? schema.fields : Object.keys(schema.fields || {})).forEach(key => {
        if (key in schema._fields)
            return;
        schema._fields[key] = new FieldDefinition();
    });
    Object.defineProperties(schema, {
        _namespace: { value: namespace },
        _store: { value: store }
    });
    Object.freeze(schema);
}

const isList = (definition) => Array.isArray(definition);
function relations(relatives, schemaFields) {
    if ([null, undefined].includes(relatives)) {
        return {};
    }
    else if (!Array.isArray(relatives) && !isString(relatives)) {
        return relatives;
    }
    if (isString(relatives)) {
        relatives = [relatives];
    }
    if (Array.isArray(relatives)) {
        const result = {};
        relatives.forEach(relative => {
            let fieldDefs = schemaFields;
            let t = result;
            const paths = relative.split('.');
            for (let i = 0; i < paths.length; i++) {
                if (paths[i] === '*') {
                    if (fieldDefs) {
                        fillRelationships(t, fieldDefs);
                    }
                    break;
                }
                const fieldDef = fieldDefs === null || fieldDefs === void 0 ? void 0 : fieldDefs[paths[i]];
                t[paths[i]] = t[paths[i]] || createObject();
                t = t[paths[i]];
                fieldDefs = fieldDef && getRelationshipSchema(fieldDef)._fields;
            }
        });
        return result;
    }
}
function fillRelationships(t, fieldDefs) {
    Object.entries(fieldDefs).forEach(([key, def]) => {
        if (key in t || !def.isRelationship) {
            return;
        }
        t[key] = createObject();
    });
}
function getRelationshipSchema(field) {
    if (field instanceof FieldDefinition) {
        if (!field.isRelationship)
            return null;
        field = field.entity;
    }
    return Array.isArray(field) ? field[0] : field;
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

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

var Mutations;
(function (Mutations) {
    Mutations["ADD"] = "ADD";
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

function normalize(raw, entityDef, visited = new Map(), entities = new Map(), depth = 0) {
    const schema = getRelationshipSchema(entityDef);
    const fields = schema._fields;
    let normalized = {};
    let result;
    if (raw == null) {
        result = null;
    }
    else if (Array.isArray(raw) && Array.isArray(entityDef)) {
        result = raw
            .map(r => {
            const { result } = normalize(r, schema, visited, entities, depth + 1);
            return result;
        })
            .filter(id => id != null);
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
                    normalized[key] = fields[key].isRelationship
                        ? normalize(value, fields[key].entity, visited, entities, depth + 1).result
                        : value;
                }
            }
            if (!entities.has(schema)) {
                entities.set(schema, createObject());
            }
            entities.get(schema)[id] = Object.assign(Object.assign({}, entities.get(schema)[id]), normalized);
        }
    }
    return {
        result,
        entities
    };
}

function getConstructor(model) {
    return model.constructor;
}
function validateEntry(data, definition) {
    const relDef = getRelationshipSchema(definition);
    return definition.isList ? data.every(item => getIdValue(item, relDef) != null) : getIdValue(data, relDef) != null;
}
function normalizeAndStore(store, data, entityDef) {
    const { entities, result } = normalize(data, entityDef);
    for (const [schema, items] of entities.entries()) {
        store.commit(`${schema._namespace}/${Mutations.ADD_ALL}`, { schema, items }, { root: true });
    }
    return result;
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
            const { Schema } = this._extractUtils();
            validateItems(args, Schema);
            method.apply(this, args);
        };
    };
}
function validateSplice() {
    return (target, key, descriptor) => {
        const method = descriptor.value;
        descriptor.value = function (...args) {
            const { Schema } = this._extractUtils();
            let [, , ...items] = args;
            items.length && validateItems(items, Schema);
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
            _store: { value: getConstructor(context)._store }
        });
        super.push.apply(this, items);
        Object.setPrototypeOf(this, ModelArray.prototype);
    }
    push(...items) {
        var _a;
        const { Schema, rawContext } = this._extractUtils(true);
        const referenceArray = rawContext[this._key] || [];
        items.forEach(item => normalizeAndStore(this._store, item, Schema));
        const ids = items.map(item => getIdValue(item, Schema));
        this._mutateContext([...referenceArray, ...ids]);
        super.push(...Schema.findByIds(ids, { load: (_a = this._context._load) === null || _a === void 0 ? void 0 : _a[this._key] }));
        return this.length;
    }
    pop() {
        const { Schema } = this._extractUtils();
        const removed = super.pop();
        this._mutateContext(this.map(item => getIdValue(item, Schema)));
        return removed;
    }
    unshift(...items) {
        var _a;
        const { Schema, rawContext } = this._extractUtils(true);
        const referenceArray = rawContext[this._key] || [];
        items.forEach(item => normalizeAndStore(this._store, item, Schema));
        const ids = items.map(item => getIdValue(item, Schema));
        this._mutateContext([...ids, ...referenceArray]);
        super.unshift(...Schema.findByIds(ids, { load: (_a = this._context._load) === null || _a === void 0 ? void 0 : _a[this._key] }));
        return this.length;
    }
    shift() {
        const { Schema } = this._extractUtils();
        const removed = super.shift();
        this._mutateContext(this.map(item => getIdValue(item, Schema)));
        return removed;
    }
    splice(...args) {
        const [start, count, ...rest] = args;
        const { Schema } = this._extractUtils();
        let result;
        rest.forEach(item => normalizeAndStore(this._store, item, Schema));
        result = args.length === 0 ? [] : super.splice(start, count, ...rest);
        this._mutateContext(this.map(item => getIdValue(item, Schema)));
        return result;
    }
    _mutateContext(value) {
        const { ContextSchema } = this._extractUtils();
        this._store.commit(`${ContextSchema._namespace}/${Mutations.SET_PROP}`, {
            id: this._context._id,
            key: this._key,
            value,
            schema: ContextSchema
        });
    }
    _extractUtils(withRawData = false) {
        const ContextSchema = getConstructor(this._context);
        const Schema = getRelationshipSchema(ContextSchema._fields[this._key]);
        const rawContext = withRawData
            ? this._store.getters[`${ContextSchema._namespace}/${Getters.GET_RAW}`](getIdValue(this._context, ContextSchema), ContextSchema)
            : null;
        return {
            ContextSchema,
            rawContext,
            Schema
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

const cacheNames = ['data', 'relationship'];
function ModelDecorator(constructor) {
    return constructor;
}
const getCacheName = isRelationship => cacheNames[isRelationship ? 1 : 0];
const parseIfLiteral = (id, Schema) => {
    return ['string', 'number'].includes(typeof id) ? Schema.find(id) : id;
};
function cacheDefaults(model, overrides = {}) {
    Object.entries(getConstructor(model)._fields).forEach(([key, definition]) => {
        var _a;
        model._caches[getCacheName(definition.isRelationship)][key] = (_a = overrides[key]) !== null && _a !== void 0 ? _a : definition.default;
    });
}
function createAccessor(target, key) {
    const Schema = getConstructor(target);
    const { _namespace: path, _store, _fields, id } = Schema;
    const isRelationship = key in _fields && _fields[key].isRelationship;
    const relationshipDef = isRelationship ? _fields[key] : null;
    Object.defineProperty(target, key, {
        enumerable: true,
        get() {
            var _a;
            if (target._connected) {
                const raw = _store.getters[`${path}/${Getters.GET_RAW}`](this._id, Schema);
                const value = raw[key];
                if (isRelationship) {
                    const opts = { load: (_a = target._load) === null || _a === void 0 ? void 0 : _a[key] };
                    const Related = getRelationshipSchema(relationshipDef);
                    if (relationshipDef.isList) {
                        return value && new ModelArray(target, key, Related.findByIds(value, opts));
                    }
                    return Related.find(value, opts);
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
                    const Related = getRelationshipSchema(relationshipDef);
                    value = parseIfLiteral(value, Related);
                    if (relationshipDef.isList) {
                        value = Array.isArray(value) ? value : [value].filter(identity);
                    }
                    if (target._connected) {
                        if (!validateEntry(value, relationshipDef)) {
                            throw new Error(`An item being assigned to the property [${key}] does not have a valid identifier`);
                        }
                        value = normalizeAndStore(_store, value, relationshipDef.entity);
                    }
                }
                else if (target._connected && (isFunction(id) || id == key)) {
                    const oldId = getIdValue(target, Schema);
                    const newId = getIdValue(Object.assign(Object.assign({}, target), { [key]: value }), Schema);
                    if (oldId != newId) {
                        throw new Error('This update is not allowed becasue the resolved id is different from the orginal value');
                    }
                }
            }
            target._connected
                ? _store.commit(`${path}/${Mutations.SET_PROP}`, { id: this._id, key, value, schema: Schema })
                : Vue.set(this._caches[getCacheName(isRelationship)], key, value);
        }
    });
}
function getIdValue(model, schema) {
    return isFunction(schema.id) ? schema.id(model, null, null) : model[schema.id];
}
let Model = class Model {
    constructor(data, opts = {}) {
        this._connected = false;
        const id = data ? getIdValue(data, getConstructor(this)) : null;
        Object.defineProperties(this, {
            _caches: { value: Object.fromEntries(cacheNames.map(name => [name, {}])) },
            _connected: { value: !!(opts === null || opts === void 0 ? void 0 : opts.connected), enumerable: false, configurable: true },
            _load: { value: opts === null || opts === void 0 ? void 0 : opts.load, enumerable: false, configurable: true },
            _id: { value: id, enumerable: false, configurable: false, writable: true }
        });
        const { _fields } = getConstructor(this);
        Object.keys(_fields).forEach(key => {
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
    toJSON(parentkey, parentNode) {
        const constructor = getConstructor(this);
        return Object.entries(this).reduce((acc, [key, val]) => {
            if (key in constructor._fields) {
                if (constructor._fields[key].isRelationship) {
                    if (!this._load || (this._load && key in this._load)) {
                        const node = { item: this, parentNode };
                        if (val == null) {
                            acc[key] = val;
                        }
                        else if (Array.isArray(val)) {
                            acc[key] = val.map(item => item.toJSON ? (hasSeen(item, node) ? '>>> Recursive item <<<' : item.toJSON(key, node)) : item);
                        }
                        else {
                            acc[key] = val.toJSON ? (hasSeen(val, node) ? '>>> Recursive item <<<' : val.toJSON(key, node)) : val;
                        }
                    }
                }
                else {
                    acc[key] = val;
                }
            }
            return acc;
        }, {});
    }
    $toObject() {
        return JSON.parse(JSON.stringify(this));
    }
    $update(data = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const constructor = getConstructor(this);
            return constructor._store
                .dispatch(`${constructor._namespace}/update`, {
                id: this._id,
                data,
                schema: constructor
            })
                .then(id => {
                this._connected = true;
                return id;
            });
        });
    }
    // @createLogger('save')
    $save() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                const constructor = getConstructor(this);
                if (this._connected) {
                    console.warn('No need calling $save');
                }
                else {
                    const item = cacheNames.reduce((acc, name) => {
                        return Object.assign(Object.assign({}, acc), this._caches[name]);
                    }, {});
                    resolve(constructor._store
                        .dispatch(`${constructor._namespace}/${Actions.ADD}`, { items: item, schema: constructor })
                        .then(res => {
                        this._id = res;
                        this._connected = true;
                        return res;
                    }));
                }
            });
        });
    }
    $addRelated(related, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const constructor = getConstructor(this);
            return constructor._store.dispatch(`${constructor._namespace}/${Actions.ADD_RELATED}`, {
                id: this._id,
                related,
                data,
                schema: constructor
            });
        });
    }
    $removeRelated(related, relatedId) {
        return __awaiter(this, void 0, void 0, function* () {
            const constructor = getConstructor(this);
            return constructor._store.dispatch(`${constructor._namespace}/${Actions.REMOVE_RELATED}`, {
                id: this._id,
                related,
                relatedId,
                schema: constructor
            });
        });
    }
    /**
     * @deprecated
     */
    static get relationships() {
        return {};
    }
    static get fields() {
        return {};
    }
    static find(id, opts = {}) {
        return this._store.getters[`${this._namespace}/${Getters.FIND}`](id, this, opts);
    }
    static findByIds(ids, opts = {}) {
        return this._store.getters[`${this._namespace}/${Getters.FIND_BY_IDS}`](ids, this, opts);
    }
    static all(opts = {}) {
        return this._store.getters[`${this._namespace}/${Getters.ALL}`](this, opts);
    }
    static add(item) {
        return this._store.dispatch(`${this._namespace}/${Actions.ADD}`, { items: item, schema: this });
    }
    static addAll(items) {
        return this._store.dispatch(`${this._namespace}/${Actions.ADD}`, { items, schema: [this] });
    }
};
Model.id = 'id';
Model = __decorate([
    ModelDecorator
], Model);

const sum = require('hash-sum');
function createModule(store) {
    return {
        namespaced: true,
        state: () => ({}),
        mutations: {
            [Mutations.ADD](state, { id, entity, schema }) {
                Vue.set(state[schema.entityName], id, Object.assign(Object.assign({}, state[schema.entityName][id]), entity));
            },
            [Mutations.ADD_ALL](state, { items, schema }) {
                Object.entries(items).forEach(([id, entity]) => {
                    Vue.set(state[schema.entityName], id, Object.assign(Object.assign({}, state[schema.entityName][id]), entity));
                });
            },
            [Mutations.SET_PROP](state, { id, key, value, schema }) {
                if (state[schema.entityName][id] == null) {
                    throw new Error('Entity does not exist');
                }
                Vue.set(state[schema.entityName][id], key, value);
            }
        },
        actions: {
            [Actions.ADD](ctx, { items, schema }) {
                return normalizeAndStore(store, items, schema);
            },
            [Actions.ADD_RELATED]({ dispatch, getters }, { id, related, data, schema }) {
                if (!(related in schema._fields) && schema._fields[related].isRelationship) {
                    throw new Error(`Unknown Relationship: [${related}]`);
                }
                const item = getters[Getters.FIND](id, { load: [related] }, schema);
                if (!item) {
                    throw new Error("The item doesn't exist");
                }
                const relationshipDef = schema._fields[related];
                if (relationshipDef.isList) {
                    const items = (Array.isArray(data) ? data : [data]).filter(identity);
                    data = item[related] || [];
                    data = mergeUnique(data.concat(items), item => getIdValue(item, getRelationshipSchema(relationshipDef)));
                }
                return dispatch(Actions.UPDATE, {
                    id,
                    data: {
                        [related]: data
                    },
                    schema
                });
            },
            [Actions.REMOVE_RELATED]({ dispatch, getters }, { id, related, relatedId, schema }) {
                if (!(related in schema._fields) && schema._fields[related].isRelationship) {
                    throw new Error(`Unknown Relationship: [${related}]`);
                }
                const ids = Array.isArray(id) ? id : [id];
                const items = getters[Getters.FIND_BY_IDS](ids, { load: [related] }, schema);
                if (items.length === 0) {
                    console.warn('Invalid id Provided');
                    return;
                }
                const relationshipDef = schema._fields[related];
                const relatedSchema = getRelationshipSchema(relationshipDef);
                if (isList(relationshipDef)) {
                    const relatedIds = relatedId ? (Array.isArray(relatedId) ? relatedId : [relatedId]) : [];
                    return Promise.all(items.map(item => {
                        const relatedItems = relatedIds.length ? item[related] || [] : [];
                        return dispatch(Actions.UPDATE, {
                            id,
                            data: {
                                [related]: relatedItems.filter(item => !relatedIds.includes(getIdValue(item, relatedSchema)))
                            },
                            schema
                        });
                    }));
                }
                else {
                    return dispatch(Actions.UPDATE, {
                        id,
                        data: {
                            [related]: null
                        },
                        schema
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
                    newItems = items.map(item => (Object.assign(Object.assign({}, item), data)));
                    const oldIds = items.map(item => getIdValue(item, schema));
                    const newIds = newItems.map(item => getIdValue(item, schema));
                    const idHasChanged = oldIds.some((id, index) => id != newIds[index]);
                    if (idHasChanged) {
                        throw new Error('Invalid Update: This would cause a change in the computed id.');
                    }
                }
                else {
                    const idName = schema.id;
                    newItems = items.map(item => (Object.assign(Object.assign(Object.assign({}, (isFunction(schema.id) ? item : null)), data), { [idName]: id })));
                }
                return dispatch(Actions.ADD, { items: newItems, schema: [schema] });
            }
        },
        getters: {
            [Getters.GET_RAW]: (state) => (id, schema) => state[schema.entityName][id],
            [Getters.FIND]: (state, getters, rootState, rootGetters) => (id, schema, opts = {}) => {
                const data = getters[Getters.GET_RAW](id, schema);
                if (!data) {
                    return;
                }
                const load = opts.load && relations(opts.load, schema._fields);
                return resolveModel(schema, data, { load, connected: true });
            },
            [Getters.FIND_BY_IDS]: (state, getters) => {
                return function (ids = [], schema, opts = {}) {
                    return ids.map(id => getters[Getters.FIND](id, schema, opts)).filter(identity);
                };
            },
            [Getters.ALL]: (state, getters) => (schema, opts = {}) => {
                return getters[Getters.FIND_BY_IDS](Object.keys(state[schema.entityName]), schema, opts);
            }
        }
    };
}
const modelCache = new Map();
function resolveModel(schema, rawData, options = {}) {
    var _a;
    const id = getIdValue(rawData, schema);
    const sumObject = { id, load: options === null || options === void 0 ? void 0 : options.load };
    const sumValue = sum(sumObject);
    if (!modelCache.has(schema)) {
        modelCache.set(schema, createObject());
    }
    const cache = modelCache.get(schema);
    return (_a = cache[sumValue]) !== null && _a !== void 0 ? _a : (cache[sumValue] = new schema(rawData, options));
}
window.modelCache = modelCache;

function Field(options = {}) {
    return (target, propname, other) => {
        const constructor = target.constructor;
        if (constructor._fields == null) {
            constructor._fields = createObject();
        }
        constructor._fields[propname] = new FieldDefinition(isFunction(options) ? { entity: options } : options);
    };
}

const defaultPluginOptions = {
    schemas: [],
    namespace: 'database'
};
function generateDatabasePlugin(options) {
    const { schemas, namespace } = Object.assign(Object.assign({}, defaultPluginOptions), options);
    return store => {
        store.registerModule(namespace, createModule(store));
        schemas.forEach(schema => {
            registerSchema(schema, store, namespace);
        });
    };
}

export { Field, Model, generateDatabasePlugin };
