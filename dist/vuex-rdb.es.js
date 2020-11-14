import Vue from 'vue';

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
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

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

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

var identity = function (k) { return k; };
function mergeUnique(items, key) {
    var keyFunction = isFunction(key) ? key : function (item) { return item[key]; };
    var map = new Map();
    items.forEach(function (item) {
        var key = keyFunction.call(null, item);
        map.set(key, map.has(key) ? __assign(__assign({}, map.get(key)), item) : item);
    });
    return __spread(map.values());
}
function isFunction(fn) {
    return fn instanceof Function;
}
function isString(string) {
    return typeof string === 'string';
}
function createObject(object) {
    var o = Object.create(null);
    object && Object.entries(object).forEach(function (_a) {
        var _b = __read(_a, 2), key = _b[0], value = _b[1];
        o[key] = value;
    });
    return o;
}
var get = function (path, obj, defaultVal) {
    if (defaultVal === void 0) { defaultVal = undefined; }
    var returnable = path.split('.').reduce(function (acc, i) {
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

var FieldDefinition = /** @class */ (function () {
    function FieldDefinition(options) {
        if (options === void 0) { options = {}; }
        this._entity = options.entity;
        this._default = options.default;
    }
    Object.defineProperty(FieldDefinition.prototype, "default", {
        get: function () {
            return isFunction(this._default) ? this._default() : this._default;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FieldDefinition.prototype, "isRelationship", {
        get: function () {
            return this.entity != null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FieldDefinition.prototype, "entity", {
        get: function () {
            var _a;
            return (_a = this._entity) === null || _a === void 0 ? void 0 : _a.call(this);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FieldDefinition.prototype, "isList", {
        get: function () {
            if (this._list != null) {
                return this._list;
            }
            return this._list = Array.isArray(this.entity);
        },
        enumerable: false,
        configurable: true
    });
    return FieldDefinition;
}());

function registerSchema(schema, store, namespace) {
    if (!schema._fields) {
        Object.defineProperty(schema, '_fields', {
            value: createObject({})
        });
    }
    if (!store.state[namespace][schema.entityName]) {
        Vue.set(store.state[namespace], schema.entityName, {});
    }
    if (typeof schema.id == 'string' && !(schema.id in schema._fields)) {
        schema._fields[schema.id] = new FieldDefinition();
    }
    Object.entries(schema.relationships || {}).forEach(function (_a) {
        var _b = __read(_a, 2), key = _b[0], value = _b[1];
        if (key in schema._fields)
            return;
        schema._fields[key] = new FieldDefinition({
            entity: function () { return value; }
        });
    });
    (Array.isArray(schema.fields) ? schema.fields : Object.keys(schema.fields || {})).forEach(function (key) {
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

var isList = function (definition) { return Array.isArray(definition); };
function getRelationshipSchema(field) {
    if (field instanceof FieldDefinition) {
        if (!field.isRelationship)
            return null;
        field = field.entity;
    }
    return Array.isArray(field) ? field[0] : field;
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

function normalize(raw, entityDef, visited, entities, depth) {
    var e_1, _a;
    if (visited === void 0) { visited = new Map(); }
    if (entities === void 0) { entities = new Map(); }
    if (depth === void 0) { depth = 0; }
    var schema = getRelationshipSchema(entityDef);
    var fields = schema._fields;
    var normalized = {};
    var result;
    if (raw == null) {
        result = null;
    }
    else if (Array.isArray(raw) && Array.isArray(entityDef)) {
        result = raw
            .map(function (r) {
            var result = normalize(r, schema, visited, entities, depth + 1).result;
            return result;
        })
            .filter(function (id) { return id != null; });
    }
    else {
        if (visited.has(raw)) {
            result = visited.get(raw);
        }
        else {
            var id = getIdValue(raw, schema);
            result = id;
            visited.set(raw, id);
            try {
                for (var _b = __values(Object.entries(raw)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var _d = __read(_c.value, 2), key = _d[0], value = _d[1];
                    if (key in fields) {
                        normalized[key] = fields[key].isRelationship
                            ? normalize(value, fields[key].entity, visited, entities, depth + 1).result
                            : value;
                    }
                    else {
                        // Ignore if this property isn't defined on the model
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            if (!entities.has(schema)) {
                entities.set(schema, createObject());
            }
            entities.get(schema)[id] = __assign(__assign({}, entities.get(schema)[id]), normalized);
        }
    }
    return {
        result: result,
        entities: entities
    };
}

function getConstructor(model) {
    return model.constructor;
}
function validateEntry(data, definition) {
    var relDef = getRelationshipSchema(definition);
    return definition.isList ? data.every(function (item) { return getIdValue(item, relDef) != null; }) : getIdValue(data, relDef) != null;
}
function normalizeAndStore(store, data, entityDef) {
    var e_1, _a;
    var _b = normalize(data, entityDef), entities = _b.entities, result = _b.result;
    try {
        for (var _c = __values(entities.entries()), _d = _c.next(); !_d.done; _d = _c.next()) {
            var _e = __read(_d.value, 2), schema = _e[0], items = _e[1];
            store.commit(schema._namespace + "/" + Mutations.ADD_ALL, { schema: schema, items: items }, { root: true });
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return result;
}

function validateItems(items, schema) {
    var e_1, _a;
    try {
        for (var items_1 = __values(items), items_1_1 = items_1.next(); !items_1_1.done; items_1_1 = items_1.next()) {
            var item = items_1_1.value;
            if (getIdValue(item, schema) == null) {
                throw new Error("An item being assigned to this array does not have a valid identifier");
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (items_1_1 && !items_1_1.done && (_a = items_1.return)) _a.call(items_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
}
function validate() {
    return function (target, key, descriptor) {
        var method = descriptor.value;
        descriptor.value = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var schema = this._extractUtils().schema;
            validateItems(args, schema);
            method.apply(this, args);
        };
    };
}
function validateSplice() {
    return function (target, key, descriptor) {
        var method = descriptor.value;
        descriptor.value = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var schema = this._extractUtils().schema;
            var _a = __read(args), items = _a.slice(2);
            items.length && validateItems(items, schema);
            method.apply(this, args);
        };
    };
}
var ModelArray = /** @class */ (function (_super) {
    __extends(ModelArray, _super);
    function ModelArray(context, key, items) {
        var _this = _super.call(this) || this;
        Object.defineProperties(_this, {
            _context: { value: context },
            _key: { value: key },
            _store: { value: getConstructor(context)._store }
        });
        _super.prototype.push.apply(_this, items);
        Object.setPrototypeOf(_this, ModelArray.prototype);
        return _this;
    }
    ModelArray.prototype.push = function () {
        var _this = this;
        var _a;
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        var _b = this._extractUtils(true), schema = _b.schema, rawContext = _b.rawContext;
        var referenceArray = rawContext[this._key] || [];
        items.forEach(function (item) { return normalizeAndStore(_this._store, item, schema); });
        var ids = items.map(function (item) { return getIdValue(item, schema); });
        this._mutateContext(__spread(referenceArray, ids));
        _super.prototype.push.apply(this, __spread(schema.findByIds(ids, { load: (_a = this._context._load) === null || _a === void 0 ? void 0 : _a[this._key] })));
        return this.length;
    };
    ModelArray.prototype.pop = function () {
        var schema = this._extractUtils().schema;
        var removed = _super.prototype.pop.call(this);
        this._mutateContext(this.map(function (item) { return getIdValue(item, schema); }));
        return removed;
    };
    ModelArray.prototype.unshift = function () {
        var _this = this;
        var _a;
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        var _b = this._extractUtils(true), schema = _b.schema, rawContext = _b.rawContext;
        var referenceArray = rawContext[this._key] || [];
        items.forEach(function (item) { return normalizeAndStore(_this._store, item, schema); });
        var ids = items.map(function (item) { return getIdValue(item, schema); });
        this._mutateContext(__spread(ids, referenceArray));
        _super.prototype.unshift.apply(this, __spread(schema.findByIds(ids, { load: (_a = this._context._load) === null || _a === void 0 ? void 0 : _a[this._key] })));
        return this.length;
    };
    ModelArray.prototype.shift = function () {
        var schema = this._extractUtils().schema;
        var removed = _super.prototype.shift.call(this);
        this._mutateContext(this.map(function (item) { return getIdValue(item, schema); }));
        return removed;
    };
    ModelArray.prototype.splice = function () {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _a = __read(args), start = _a[0], count = _a[1], rest = _a.slice(2);
        var schema = this._extractUtils().schema;
        var result;
        rest.forEach(function (item) { return normalizeAndStore(_this._store, item, schema); });
        result = args.length === 0 ? [] : _super.prototype.splice.apply(this, __spread([start, count], rest));
        this._mutateContext(this.map(function (item) { return getIdValue(item, schema); }));
        return result;
    };
    ModelArray.prototype._mutateContext = function (value) {
        var schema = this._extractUtils().contextSchema;
        this._store.commit(schema._namespace + "/" + Mutations.SET_PROP, {
            id: this._context._id,
            key: this._key,
            value: value,
            schema: schema
        });
    };
    ModelArray.prototype._extractUtils = function (withRawData) {
        if (withRawData === void 0) { withRawData = false; }
        var contextSchema = getConstructor(this._context);
        var schema = getRelationshipSchema(contextSchema._fields[this._key]);
        var rawContext = withRawData
            ? this._store.getters[contextSchema._namespace + "/" + Getters.GET_RAW](getIdValue(this._context, contextSchema), contextSchema)
            : null;
        return {
            contextSchema: contextSchema,
            rawContext: rawContext,
            schema: schema
        };
    };
    __decorate([
        validate()
    ], ModelArray.prototype, "push", null);
    __decorate([
        validate()
    ], ModelArray.prototype, "unshift", null);
    __decorate([
        validateSplice()
    ], ModelArray.prototype, "splice", null);
    return ModelArray;
}(Array));
window.ModelArray = ModelArray;

var Query = /** @class */ (function () {
    function Query() {
        this.and = [];
        this.or = [];
    }
    Query.prototype.where = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.addWhere.apply(this, __spread(['and'], args));
        return this;
    };
    Query.prototype.orWhere = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.addWhere.apply(this, __spread(['or'], args));
        return this;
    };
    Query.prototype.addWhere = function (type) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        switch (args.length) {
            case 1:
                if (!isFunction(args[0])) {
                    throw new Error('Argument should be a function');
                }
                this[type].push({
                    key: args[0]
                });
                break;
            case 2:
                this[type].push({
                    key: args[0],
                    value: args[1]
                });
                break;
            case 3:
                this[type].push({
                    key: args[0],
                    operand: args[1],
                    value: args[2]
                });
                break;
            default:
                throw new Error('Illegal arguments supplied');
        }
    };
    return Query;
}());

var ContextualQuery = /** @class */ (function (_super) {
    __extends(ContextualQuery, _super);
    function ContextualQuery(context) {
        var _this = _super.call(this) || this;
        _this.context = context;
        return _this;
    }
    ContextualQuery.prototype.matchItem = function (item) {
        var result = [];
        var comparator = getComparator(item);
        result.push(!!(this.and.length && this.and.every(comparator)));
        result.push(!!(this.or.length && this.or.some(comparator)));
        return result.some(identity);
    };
    ContextualQuery.prototype.get = function () {
        return this.matchItem(this.context);
    };
    return ContextualQuery;
}(Query));

var getComparator = function (item) { return function (where) {
    if (isFunction(where.key)) {
        var query = new ContextualQuery(item);
        var result = where.key.call(null, query, item);
        if (typeof result == 'boolean') {
            return result;
        }
        return query.get();
    }
    else if (isString(where.key) && isFunction(where.value)) {
        var value = get(where.key, item);
        var query = new ContextualQuery(value);
        var result = where.value.call(null, query, value);
        if (typeof result == 'boolean')
            return result;
        return query.get();
    }
    else if (isString(where.key) && !isFunction(where.value)) {
        var resolved = get(where.key, item);
        var isArray = Array.isArray(resolved);
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
}; };
var addToLoads = function (key, relationship, originalLoad, newLoads) {
    if (originalLoad.has(key)) {
        newLoads.push(originalLoad.getLoad(key));
    }
    else {
        var newLoad = new Load(relationship);
        originalLoad.addLoad(key, newLoad);
        newLoads.push(newLoad);
    }
};
function getLoads(loads, key) {
    var e_1, _a;
    var newLoads = [];
    var _loop_1 = function (load) {
        var schema = getRelationshipSchema(load.getRelationship());
        if (key === '*') {
            Object.entries(schema._fields)
                .filter(function (_a) {
                var _b = __read(_a, 2), fieldDef = _b[1];
                return fieldDef.isRelationship;
            })
                .forEach(function (_a) {
                var _b = __read(_a, 2), key = _b[0], value = _b[1];
                addToLoads(key, value.entity, load, newLoads);
            });
        }
        else if (!schema._fields[key] || !schema._fields[key].isRelationship) {
            console.warn("[" + key + "] is not a relationship");
        }
        else {
            addToLoads(key, schema._fields[key].entity, load, newLoads);
        }
    };
    try {
        for (var loads_1 = __values(loads), loads_1_1 = loads_1.next(); !loads_1_1.done; loads_1_1 = loads_1.next()) {
            var load = loads_1_1.value;
            _loop_1(load);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (loads_1_1 && !loads_1_1.done && (_a = loads_1.return)) _a.call(loads_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return newLoads;
}

var Load = /** @class */ (function () {
    function Load(relationship) {
        this.relationship = relationship;
        this.loads = new Map();
        this.conditions = new Set();
    }
    Load.prototype.addLoad = function (name, load) {
        this.loads.set(name, load);
    };
    Load.prototype.getLoad = function (name) {
        return this.loads.get(name);
    };
    Load.prototype.has = function (name) {
        return this.loads.has(name);
    };
    Load.prototype.addCondition = function (where) {
        this.conditions.add(where);
    };
    Load.prototype.apply = function (data) {
        if (this.conditions.size == 0 || data == null)
            return data;
        var conditions = __spread(this.conditions);
        if (Array.isArray(this.relationship)) {
            return data.filter(function (item) {
                return conditions.some(function (condition) { return condition.matchItem(item); });
            });
        }
        else if (conditions.some(function (condition) { return condition.matchItem(data); })) {
            return data;
        }
    };
    Load.prototype.getRelationship = function () {
        return this.relationship;
    };
    Load.prototype.parse = function () {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var rawLoads = this.parseRawLoadArgs.apply(this, __spread(args));
        Object.entries(rawLoads).forEach(function (_a) {
            var _b = __read(_a, 2), key = _b[0], val = _b[1];
            var segments = key.split('.'); // [user, posts, *, issues, comments]
            var loads = segments.reduce(function (loads, segment) { return getLoads(loads, segment); }, [_this]);
            loads.forEach(function (load) {
                if (isFunction(val)) {
                    var query = new LoadQuery(load);
                    val.call(null, query);
                    load.addCondition(query);
                }
                else
                    load.addCondition(new ContextualQuery({ value: true }).where('value', true));
            });
        });
        return this;
    };
    Load.prototype.parseRawLoadArgs = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var rawLoads = createObject();
        var _a = __read(args, 2), firstArg = _a[0], secondArg = _a[1];
        switch (args.length) {
            case 1:
                if (Array.isArray(firstArg)) {
                    firstArg.forEach(function (item) { return (rawLoads[item] = true); });
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
    };
    return Load;
}());
var LoadQuery = /** @class */ (function (_super) {
    __extends(LoadQuery, _super);
    function LoadQuery(load) {
        var _this = _super.call(this) || this;
        _this.load = load;
        return _this;
    }
    LoadQuery.prototype.with = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
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
    };
    LoadQuery.prototype.get = function () {
        throw new Error('Method not implemented.');
    };
    return LoadQuery;
}(ContextualQuery));

var ModelQuery = /** @class */ (function (_super) {
    __extends(ModelQuery, _super);
    function ModelQuery(schema) {
        var _this = _super.call(this) || this;
        _this.schema = schema;
        _this.withArgs = [];
        return _this;
    }
    ModelQuery.prototype.with = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.withArgs.push(args);
        return this;
    };
    ModelQuery.prototype.initLoad = function () {
        if (!this.load) {
            this.load = new Load(this.schema);
        }
    };
    ModelQuery.prototype.initLoadArgs = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
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
    };
    ModelQuery.prototype.get = function () {
        var _this = this;
        var items = this.schema.all();
        items = items.filter(function (item) { return _this.matchItem(item); });
        if (items.length) {
            if (this.withArgs.length) {
                this.initLoad();
                this.withArgs.forEach(function (arg) {
                    _this.initLoadArgs.apply(_this, __spread(arg));
                });
            }
            items = items.map(function (item) {
                return _this.schema.find(getIdValue(item, _this.schema), { load: _this.load });
            });
        }
        return items;
    };
    return ModelQuery;
}(ContextualQuery));

var cacheNames = ['data', 'relationship'];
var getCacheName = function (isRelationship) { return cacheNames[isRelationship ? 1 : 0]; };
var parseIfLiteral = function (id, schema) {
    return ['string', 'number'].includes(typeof id) ? schema.find(id) : id;
};
function cacheDefaults(model, overrides) {
    if (overrides === void 0) { overrides = {}; }
    Object.entries(getConstructor(model)._fields).forEach(function (_a) {
        var _b;
        var _c = __read(_a, 2), key = _c[0], definition = _c[1];
        model._caches[getCacheName(definition.isRelationship)][key] = (_b = overrides[key]) !== null && _b !== void 0 ? _b : definition.default;
    });
}
function createAccessor(target, key) {
    var schema = getConstructor(target);
    var path = schema._namespace, _store = schema._store, _fields = schema._fields, id = schema.id;
    var isRelationship = key in _fields && _fields[key].isRelationship;
    var relationshipDef = isRelationship ? _fields[key] : null;
    var load = target._load;
    Object.defineProperty(target, key, {
        enumerable: load && isRelationship ? load.has(key) : true,
        get: function () {
            if (target._connected) {
                if (load && isRelationship && !load.has(key))
                    return;
                var raw = _store.getters[path + "/" + Getters.GET_RAW](this._id, schema);
                var value = raw[key];
                if (isRelationship) {
                    var opts = { load: load === null || load === void 0 ? void 0 : load.getLoad(key) };
                    var Related = getRelationshipSchema(relationshipDef);
                    if (relationshipDef.isList) {
                        if (value) {
                            value = Related.findByIds(value, opts);
                            if (!opts.load) {
                                return value;
                            }
                            else {
                                value = opts.load.apply(value);
                                return value && new ModelArray(target, key, value);
                            }
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
        set: function (value) {
            var _a;
            if (value != null) {
                if (isRelationship) {
                    var Related = getRelationshipSchema(relationshipDef);
                    value = parseIfLiteral(value, Related);
                    if (relationshipDef.isList) {
                        value = Array.isArray(value) ? value : [value].filter(identity);
                    }
                    if (target._connected) {
                        if (!validateEntry(value, relationshipDef)) {
                            throw new Error("An item being assigned to the property [" + key + "] does not have a valid identifier");
                        }
                        value = normalizeAndStore(_store, value, relationshipDef.entity);
                    }
                }
                else if (target._connected && (isFunction(id) || id == key)) {
                    var oldId = getIdValue(target, schema);
                    var newId = getIdValue(__assign(__assign({}, target), (_a = {}, _a[key] = value, _a)), schema);
                    if (oldId != newId) {
                        throw new Error('This update is not allowed becasue the resolved id is different from the orginal value');
                    }
                }
            }
            target._connected
                ? _store.commit(path + "/" + Mutations.SET_PROP, { id: this._id, key: key, value: value, schema: schema })
                : Vue.set(this._caches[getCacheName(isRelationship)], key, value);
        }
    });
}
function getIdValue(model, schema) {
    return isFunction(schema.id) ? schema.id(model, null, null) : model[schema.id];
}
var Model = /** @class */ (function () {
    function Model(data, opts) {
        var _this = this;
        /**
         * Indicates wether this model is connected to the store
         */
        this._connected = false;
        var id = data ? getIdValue(data, getConstructor(this)) : null;
        Object.defineProperties(this, {
            _caches: { value: Object.fromEntries(cacheNames.map(function (name) { return [name, {}]; })) },
            _connected: { value: !!(opts === null || opts === void 0 ? void 0 : opts.connected), enumerable: false, configurable: true },
            _load: { value: opts === null || opts === void 0 ? void 0 : opts.load, enumerable: false, configurable: true },
            _id: { value: id, enumerable: false, configurable: false, writable: true }
        });
        var _fields = getConstructor(this)._fields;
        Object.keys(_fields).forEach(function (key) {
            createAccessor(_this, key);
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
    Model.prototype.toJSON = function (parentkey, parentNode) {
        var _this = this;
        var constructor = getConstructor(this);
        return Object.entries(this).reduce(function (acc, _a) {
            var _b = __read(_a, 2), key = _b[0], val = _b[1];
            if (key in constructor._fields) {
                if (constructor._fields[key].isRelationship) {
                    if (!_this._load || (_this._load && key in _this._load)) {
                        var node_1 = { item: _this, parentNode: parentNode };
                        if (val == null) {
                            acc[key] = val;
                        }
                        else if (Array.isArray(val)) {
                            acc[key] = val.map(function (item) {
                                return item.toJSON ? (hasSeen(item, node_1) ? '>>> Recursive item <<<' : item.toJSON(key, node_1)) : item;
                            });
                        }
                        else {
                            acc[key] = val.toJSON ? (hasSeen(val, node_1) ? '>>> Recursive item <<<' : val.toJSON(key, node_1)) : val;
                        }
                    }
                }
                else {
                    acc[key] = val;
                }
            }
            return acc;
        }, {});
    };
    /**
     * Converts the model to a plain javascript object.
     */
    Model.prototype.$toObject = function () {
        return JSON.parse(JSON.stringify(this));
    };
    /**
     * Update the properties of the model with the given data. You don't need to pass the full model.
     * You can pass only the props you want to update, You can also pass related models or model-like data
     */
    Model.prototype.$update = function (data) {
        if (data === void 0) { data = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var constructor;
            var _this = this;
            return __generator(this, function (_a) {
                constructor = getConstructor(this);
                return [2 /*return*/, constructor._store
                        .dispatch(constructor._namespace + "/update", {
                        id: this._id,
                        data: data,
                        schema: constructor
                    })
                        .then(function (id) {
                        _this._connected = true;
                        return id;
                    })];
            });
        });
    };
    /**
       * Useful when a model is created using `new Model()`.
       * You can assign properties to the model like you would any other javascript
       * object but the new values won't be saved to the vuex store until this method is called;
       *
       * If none model-like data has been assigned to the relationships on `this` model, calling save would
       * transform them to actual models
       */
    Model.prototype.$save = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        var constructor = getConstructor(_this);
                        if (_this._connected) {
                            console.warn('No need calling $save');
                        }
                        else {
                            var item = cacheNames.reduce(function (acc, name) {
                                return __assign(__assign({}, acc), _this._caches[name]);
                            }, {});
                            resolve(constructor._store
                                .dispatch(constructor._namespace + "/" + Actions.ADD, { items: item, schema: constructor })
                                .then(function (res) {
                                _this._id = res;
                                _this._connected = true;
                                return res;
                            }));
                        }
                    })];
            });
        });
    };
    Model.prototype.$addRelated = function (related, data) {
        return __awaiter(this, void 0, void 0, function () {
            var constructor;
            return __generator(this, function (_a) {
                constructor = getConstructor(this);
                return [2 /*return*/, constructor._store.dispatch(constructor._namespace + "/" + Actions.ADD_RELATED, {
                        id: this._id,
                        related: related,
                        data: data,
                        schema: constructor
                    })];
            });
        });
    };
    Model.prototype.$removeRelated = function (related, relatedId) {
        return __awaiter(this, void 0, void 0, function () {
            var constructor;
            return __generator(this, function (_a) {
                constructor = getConstructor(this);
                return [2 /*return*/, constructor._store.dispatch(constructor._namespace + "/" + Actions.REMOVE_RELATED, {
                        id: this._id,
                        related: related,
                        relatedId: relatedId,
                        schema: constructor
                    })];
            });
        });
    };
    Object.defineProperty(Model, "relationships", {
        /**
         * This is an alternative to the `Field(() => RelatedModel)` decorator
         *
         * A record of all the possible relationships of this Schema. Currently, two types are supported
         *
         * - list
         * - item
         *
         * lists are just Model classes in an Array while an Item is the Model Class itself
         *
         * So if we have a `UserModel` that has many `Posts`, we'd define it like so
         *
         * ```javascript
         * class UserModel extends Model {
         *   static get() {
         *     return {
         *       posts: [PostModel], // this signifies a list relationship
         *       school: SchoolModel // This represents an item type relationship
         *     }
         *   }
         * }
         * ```
         * @deprecated
         */
        get: function () {
            return {};
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Model, "fields", {
        /**
         * This is an alternative to the `Field()` decorator.
         *
         * Specify the different fields of the class
         * in an array or an object that contains the field names as it's keys
         * @deprecated
         */
        get: function () {
            return {};
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Find a model by the specified identifier
     */
    Model.find = function (id, opts) {
        if (opts === void 0) { opts = {}; }
        return this._store.getters[this._namespace + "/" + Getters.FIND](id, this, opts);
    };
    /**
     * Find all items that match the specified ids
     *
     */
    Model.findByIds = function (ids, opts) {
        if (opts === void 0) { opts = {}; }
        return this._store.getters[this._namespace + "/" + Getters.FIND_BY_IDS](ids, this, opts);
    };
    /**
     * Get all items of this type from the Database
     */
    Model.all = function (opts) {
        if (opts === void 0) { opts = {}; }
        return this._store.getters[this._namespace + "/" + Getters.ALL](this, opts);
    };
    /**
     * Add the passed item to the database. It should match this model's schema.
     *
     * It returns a promise of the inserted entity's id
     */
    Model.add = function (item) {
        return this._store.dispatch(this._namespace + "/" + Actions.ADD, { items: item, schema: this });
    };
    /**
     * Add the passed items to the database. It should match this model's schema.
     *
     * It returns a promise of an array of ids for the inserted entities.
     */
    Model.addAll = function (items) {
        return this._store.dispatch(this._namespace + "/" + Actions.ADD, { items: items, schema: [this] });
    };
    Model.query = function () {
        return new ModelQuery(this);
    };
    /**
     * The identifier for the model. It also accepts an id resolver function that
     * receives a model-like param as input and returns the id;
     * @default 'id'
     */
    Model.id = 'id';
    return Model;
}());

var sum = require('hash-sum');
function createModule(store) {
    var _a, _b, _c;
    return {
        namespaced: true,
        state: function () { return ({}); },
        mutations: (_a = {},
            _a[Mutations.ADD_ALL] = function (state, _a) {
                var items = _a.items, schema = _a.schema;
                Object.entries(items).forEach(function (_a) {
                    var _b = __read(_a, 2), id = _b[0], entity = _b[1];
                    var storeItem = state[schema.entityName][id];
                    if (!storeItem) {
                        return Vue.set(state[schema.entityName], id, entity);
                    }
                    Object.entries(entity).forEach(function (_a) {
                        var _b = __read(_a, 2), key = _b[0], value = _b[1];
                        Vue.set(storeItem, key, value);
                    });
                });
            },
            _a[Mutations.SET_PROP] = function (state, _a) {
                var id = _a.id, key = _a.key, value = _a.value, schema = _a.schema;
                if (state[schema.entityName][id] == null) {
                    throw new Error('Entity does not exist');
                }
                Vue.set(state[schema.entityName][id], key, value);
            },
            _a),
        actions: (_b = {},
            _b[Actions.ADD] = function (ctx, _a) {
                var items = _a.items, schema = _a.schema;
                return normalizeAndStore(store, items, schema);
            },
            _b[Actions.ADD_RELATED] = function (_a, _b) {
                var _c;
                var dispatch = _a.dispatch, getters = _a.getters;
                var id = _b.id, related = _b.related, data = _b.data, schema = _b.schema;
                if (!(related in schema._fields) && schema._fields[related].isRelationship) {
                    throw new Error("Unknown Relationship: [" + related + "]");
                }
                var item = getters[Getters.FIND](id, { load: [related] }, schema);
                if (!item) {
                    throw new Error("The item doesn't exist");
                }
                var relationshipDef = schema._fields[related];
                if (relationshipDef.isList) {
                    var items = (Array.isArray(data) ? data : [data]).filter(identity);
                    data = item[related] || [];
                    data = mergeUnique(data.concat(items), function (item) { return getIdValue(item, getRelationshipSchema(relationshipDef)); });
                }
                return dispatch(Actions.UPDATE, {
                    id: id,
                    data: (_c = {},
                        _c[related] = data,
                        _c),
                    schema: schema
                });
            },
            _b[Actions.REMOVE_RELATED] = function (_a, _b) {
                var _c;
                var dispatch = _a.dispatch, getters = _a.getters;
                var id = _b.id, related = _b.related, relatedId = _b.relatedId, schema = _b.schema;
                if (!(related in schema._fields) && schema._fields[related].isRelationship) {
                    throw new Error("Unknown Relationship: [" + related + "]");
                }
                var ids = Array.isArray(id) ? id : [id];
                var items = getters[Getters.FIND_BY_IDS](ids, { load: [related] }, schema);
                if (items.length === 0) {
                    console.warn('Invalid id Provided');
                    return;
                }
                var relationshipDef = schema._fields[related];
                var relatedSchema = getRelationshipSchema(relationshipDef);
                if (isList(relationshipDef)) {
                    var relatedIds_1 = relatedId ? (Array.isArray(relatedId) ? relatedId : [relatedId]) : [];
                    return Promise.all(items.map(function (item) {
                        var _a;
                        var relatedItems = relatedIds_1.length ? item[related] || [] : [];
                        return dispatch(Actions.UPDATE, {
                            id: id,
                            data: (_a = {},
                                _a[related] = relatedItems.filter(function (item) { return !relatedIds_1.includes(getIdValue(item, relatedSchema)); }),
                                _a),
                            schema: schema
                        });
                    }));
                }
                else {
                    return dispatch(Actions.UPDATE, {
                        id: id,
                        data: (_c = {},
                            _c[related] = null,
                            _c),
                        schema: schema
                    });
                }
            },
            _b[Actions.UPDATE] = function (_a, _b) {
                var getters = _a.getters, dispatch = _a.dispatch;
                var id = _b.id, data = _b.data, schema = _b.schema;
                if (id === null || id === undefined) {
                    throw new Error('Id to perform update must be defined');
                }
                var ids = Array.isArray(id) ? id : [id];
                var items = getters[Getters.FIND_BY_IDS](ids, schema).filter(identity);
                if (items.length !== ids.length) {
                    throw new Error('Invalid item to update');
                }
                var newItems;
                if (isFunction(schema.id)) {
                    // if the id definition on the model is a function, it means
                    // the value is computed. We don't want an update to change the id
                    // otherwise it'll break consistency
                    newItems = items.map(function (item) { return (__assign(__assign({}, item), data)); });
                    var oldIds = items.map(function (item) { return getIdValue(item, schema); });
                    var newIds_1 = newItems.map(function (item) { return getIdValue(item, schema); });
                    var idHasChanged = oldIds.some(function (id, index) { return id != newIds_1[index]; });
                    if (idHasChanged) {
                        throw new Error('Invalid Update: This would cause a change in the computed id.');
                    }
                }
                else {
                    var idName_1 = schema.id;
                    newItems = items.map(function (item) {
                        var _a;
                        return (__assign(__assign(__assign({}, (isFunction(schema.id) ? item : null)), data), (_a = {}, _a[idName_1] = id, _a)));
                    });
                }
                return dispatch(Actions.ADD, { items: newItems, schema: [schema] });
            },
            _b),
        getters: (_c = {},
            _c[Getters.GET_RAW] = function (state) { return function (id, schema) { return state[schema.entityName][id]; }; },
            _c[Getters.FIND] = function (state, getters, rootState, rootGetters) { return function (id, schema, opts) {
                if (opts === void 0) { opts = {}; }
                var data = getters[Getters.GET_RAW](id, schema);
                if (!data) {
                    return;
                }
                var load;
                if (opts.load) {
                    load = !(opts.load instanceof Load) ? new Load(schema).parse(opts.load) : opts.load;
                }
                return resolveModel(schema, data, { load: load, connected: true });
            }; },
            _c[Getters.FIND_BY_IDS] = function (state, getters) {
                return function (ids, schema, opts) {
                    if (ids === void 0) { ids = []; }
                    if (opts === void 0) { opts = {}; }
                    return ids.map(function (id) { return getters[Getters.FIND](id, schema, opts); }).filter(identity);
                };
            },
            _c[Getters.ALL] = function (state, getters) { return function (schema, opts) {
                if (opts === void 0) { opts = {}; }
                return getters[Getters.FIND_BY_IDS](Object.keys(state[schema.entityName]), schema, opts);
            }; },
            _c)
    };
}
var modelCache = new Map();
function resolveModel(schema, rawData, options) {
    var _a;
    if (options === void 0) { options = {}; }
    var id = getIdValue(rawData, schema);
    if (!options.load) {
        if (!modelCache.has(schema)) {
            modelCache.set(schema, createObject());
        }
        var cache = modelCache.get(schema);
        return (_a = cache[id]) !== null && _a !== void 0 ? _a : (cache[id] = new schema(rawData, options));
    }
    else
        return new schema(rawData, options);
}
window.modelCache = modelCache;

function Field(options) {
    if (options === void 0) { options = {}; }
    return function (target, propname, other) {
        var constructor = target.constructor;
        if (constructor._fields == null) {
            constructor._fields = createObject();
        }
        constructor._fields[propname] = new FieldDefinition(isFunction(options) ? { entity: options } : options);
    };
}

var defaultPluginOptions = {
    schemas: [],
    namespace: 'database'
};
function generateDatabasePlugin(options) {
    var _a = __assign(__assign({}, defaultPluginOptions), options), schemas = _a.schemas, namespace = _a.namespace;
    return function (store) {
        store.registerModule(namespace, createModule(store));
        schemas.forEach(function (schema) {
            registerSchema(schema, store, namespace);
        });
    };
}

export { Field, Model, generateDatabasePlugin };
