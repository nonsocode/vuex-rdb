'use strict';

var Vue = require('vue');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var Vue__default = /*#__PURE__*/_interopDefaultLegacy(Vue);

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
    Object.entries(object).forEach(function (_a) {
        var _b = __read(_a, 2), key = _b[0], value = _b[1];
        o[key] = value;
    });
    return o;
}

var FieldDefinition = /** @class */ (function () {
    function FieldDefinition(options) {
        if (options === void 0) { options = {}; }
        this._entity = options.entity;
        this._default = options.default;
        this._list = options.list;
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
            return !([null, undefined].includes(this.entity));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FieldDefinition.prototype, "entity", {
        get: function () {
            return this.isList ? [this._entity] : this._entity;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FieldDefinition.prototype, "isList", {
        get: function () {
            return !!this._list;
        },
        enumerable: false,
        configurable: true
    });
    FieldDefinition.prototype.setList = function (val) {
        this._list = !!val;
    };
    FieldDefinition.prototype.setEntity = function (entity) {
        this._entity = entity;
        return this;
    };
    FieldDefinition.prototype.lock = function () {
        Object.freeze(this);
        return this;
    };
    return FieldDefinition;
}());

var nameModelMap = new Map();
function registerSchema(schema) {
    nameModelMap.set(schema.entityName, schema);
    if (!schema._fields) {
        schema._fields = createObject({});
    }
    if (typeof schema.id == 'string' && !(schema.id in schema._fields)) {
        schema._fields[schema.id] = new FieldDefinition().lock();
    }
    Object.entries(schema.relationships || {}).forEach(function (_a) {
        var _b = __read(_a, 2), key = _b[0], value = _b[1];
        if (key in schema._fields)
            return;
        schema._fields[key] = new FieldDefinition({
            entity: Array.isArray(value) ? value[0].entityName : value.entityName,
            list: Array.isArray(value)
        }).lock();
    });
    Object.keys(schema.fields || {}).forEach(function (key) {
        if (key in schema._fields)
            return;
        schema._fields[key] = new FieldDefinition().lock();
    });
}

var Mutations;
(function (Mutations) {
    Mutations["ADD"] = "_ADD";
    Mutations["SET_PROP"] = "SET_PROP";
})(Mutations || (Mutations = {}));
var Actions;
(function (Actions) {
    Actions["ADD"] = "add";
    Actions["ADD_RELATED"] = "addRelated";
    Actions["REMOVE_RELATED"] = "removeRelated";
    Actions["ADD_ALL"] = "addAll";
    Actions["UPDATE"] = "update";
})(Actions || (Actions = {}));
var Getters;
(function (Getters) {
    Getters["FIND"] = "find";
    Getters["GET_RAW"] = "getRaw";
    Getters["FIND_BY_IDS"] = "findByIds";
    Getters["ALL"] = "all";
})(Getters || (Getters = {}));

var isList = function (definition) { return Array.isArray(definition); };
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
        var result_1 = {};
        relatives.forEach(function (relative) {
            var fieldDefs = schemaFields;
            var t = result_1;
            var paths = relative.split('.');
            for (var i = 0; i < paths.length; i++) {
                if (paths[i] === '*') {
                    if (fieldDefs) {
                        fillRelationships(t, fieldDefs);
                    }
                    break;
                }
                var fieldDef = fieldDefs === null || fieldDefs === void 0 ? void 0 : fieldDefs[paths[i]];
                t[paths[i]] = t[paths[i]] || createObject({});
                t = t[paths[i]];
                fieldDefs = fieldDef && getRelationshipSchema(fieldDef)._fields;
            }
        });
        return result_1;
    }
}
function fillRelationships(t, fieldDefs) {
    Object.entries(fieldDefs).forEach(function (_a) {
        var _b = __read(_a, 2), key = _b[0], def = _b[1];
        if (key in t || !def.isRelationship) {
            return;
        }
        t[key] = createObject({});
    });
}
function getRelationshipSchema(field) {
    if (!field.isRelationship)
        return null;
    return field.isList ? nameModelMap.get(field.entity[0]) : nameModelMap.get(field.entity);
}

var _a;
var cacheNames = ['_dataCache', '_relationshipCache'];
var reservedKeys = createObject((_a = { toJSON: true, _isVue: true }, _a[Symbol.toStringTag] = true, _a));
var getCacheName = function (target, key) {
    var _fields = target.constructor._fields;
    return (key in _fields && _fields[key].isRelationship) ? '_relationshipCache' : '_dataCache';
};
var proxySetter = function (target, key, value) {
    if (!(key in target) && !(key in reservedKeys)) {
        createAccessor(target, key);
    }
    target[key] = value;
    return true;
};
var proxyGetter = function (target, key, value) {
    /* This useful only when the fields aren't known upfront but can add a lot of unnecessary props
     when non existent fields are accessed
     */
    // if(!(key in target)  && !(key in reservedKeys)) {
    //   createAccessor(target, key)
    // }
    return target[key];
};
function createAccessor(target, key) {
    var _a = target.constructor, _path = _a._path, _store = _a._store, _fields = _a._fields;
    var isRelationship = key in _fields && _fields[key].isRelationship;
    var relationshipDef = isRelationship ? _fields[key] : null;
    Object.defineProperty(target, key, {
        enumerable: true,
        get: function () {
            if (target._connected) {
                var raw = _store.getters[_path + "/" + Getters.GET_RAW](this._id);
                var value = raw[key];
                if (isRelationship) {
                    var opts = { load: target._load[key] || {} };
                    var Related = getRelationshipSchema(relationshipDef);
                    if (relationshipDef.isList) {
                        return value && Related.findByIds(value, opts);
                    }
                    return Related.find(value, opts);
                }
                else {
                    return raw[key];
                }
            }
            return this[getCacheName(this, key)][key];
        },
        set: function (value) {
            if (target._connected) {
                if (value != null) {
                    if (isRelationship) {
                        var Related = getRelationshipSchema(relationshipDef);
                        if (relationshipDef.isList) {
                            value = Array.isArray(value) ? value : [value];
                        }
                        var _a = normalize(value, relationshipDef.entity), entities = _a.entities, result = _a.result;
                        Object.entries(entities).forEach(function (_a) {
                            var _b = __read(_a, 2), entityName = _b[0], entities = _b[1];
                            Object.entries(entities).forEach(function (_a) {
                                var _b = __read(_a, 2), id = _b[0], entity = _b[1];
                                if (!entity) {
                                    return;
                                }
                                _store.commit(nameModelMap.get(entityName)._path + "/" + Mutations.ADD, { id: id, entity: entity }, { root: true });
                            });
                        });
                        value = result;
                    }
                }
                return _store.commit(_path + "/" + Mutations.SET_PROP, { id: this._id, key: key, value: value });
            }
            else {
                this[getCacheName(this, key)][key] = value;
            }
        }
    });
}
function getIdValue(model, schema) {
    return isFunction(schema.id) ? schema.id(model, null, null) : model[schema.id];
}
var reserved = __spread(cacheNames, ['_id', '_connected']).reduce(function (acc, key) {
    acc[key] = true;
    return acc;
}, {});
var Model = /** @class */ (function () {
    function Model(data, opts) {
        var _this = this;
        if (opts === void 0) { opts = {}; }
        this._connected = false;
        Object.defineProperties(this, __assign(__assign({}, Object.fromEntries(cacheNames.map(function (cacheName) { return [cacheName, { value: {} }]; }))), { _connected: { value: !!(opts === null || opts === void 0 ? void 0 : opts.connected), enumerable: false, configurable: true }, _load: { value: ((opts === null || opts === void 0 ? void 0 : opts.load) || createObject({})), enumerable: false, configurable: true }, _id: { value: data ? getIdValue(data, this.constructor) : null, enumerable: false, configurable: false, writable: true } }));
        var _fields = this.constructor._fields;
        if (data) {
            Object.keys(data).forEach(function (key) { return createAccessor(_this, key); });
        }
        Object.keys(__assign({}, _fields)).forEach(function (key) {
            if (key in _this)
                return;
            createAccessor(_this, key);
        });
        return new Proxy(this, {
            set: proxySetter,
            get: proxyGetter,
        });
    }
    Model.prototype.toJSON = function () {
        var _this = this;
        var constructor = this.constructor;
        return Object.entries(this).reduce(function (acc, _a) {
            var _b = __read(_a, 2), key = _b[0], val = _b[1];
            if (!(key in constructor._fields && constructor._fields[key].isRelationship)) {
                acc[key] = val;
            }
            else {
                if ([key, '*'].some(function (prop) { return prop in _this._load; })) {
                    if (val == null) {
                        acc[key] = val;
                    }
                    else if (Array.isArray(val)) {
                        acc[key] = val.map(function (item) { return item.toJSON(); });
                    }
                    else {
                        acc[key] = val.toJSON();
                    }
                }
            }
            return acc;
        }, {});
    };
    Object.defineProperty(Model, "relationships", {
        get: function () {
            return {};
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Model, "fields", {
        get: function () {
            return {};
        },
        enumerable: false,
        configurable: true
    });
    Model.prototype.$update = function (data) {
        if (data === void 0) { data = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var constructor;
            var _this = this;
            return __generator(this, function (_a) {
                constructor = this.constructor;
                return [2 /*return*/, constructor._store
                        .dispatch(constructor._path + "/update", {
                        id: this._id,
                        data: data
                    })
                        .then(function (id) {
                        _this._connected = true;
                        return id;
                    })];
            });
        });
    };
    Model.prototype.$save = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        var constructor = _this.constructor;
                        if (_this._connected) {
                            console.warn('No need calling $save');
                        }
                        else {
                            var data = __assign(__assign({}, _this._dataCache), _this._relationshipCache);
                            resolve((constructor)._store.dispatch(constructor._path + "/add", data)
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
                constructor = this.constructor;
                return [2 /*return*/, constructor._store
                        .dispatch(constructor._path + "/addRelated", {
                        id: this._id,
                        related: related,
                        data: data
                    })];
            });
        });
    };
    Model.prototype.$removeRelated = function (related, relatedId) {
        return __awaiter(this, void 0, void 0, function () {
            var constructor;
            return __generator(this, function (_a) {
                constructor = this.constructor;
                return [2 /*return*/, constructor._store
                        .dispatch(constructor._path + "/removeRelated", {
                        id: this._id,
                        related: related,
                        relatedId: relatedId
                    })];
            });
        });
    };
    Model.find = function (id, opts) {
        if (opts === void 0) { opts = {}; }
        return this._store.getters[this._path + "/" + Getters.FIND](id, opts);
    };
    Model.findByIds = function (ids, opts) {
        if (opts === void 0) { opts = {}; }
        return this._store.getters[this._path + "/" + Getters.FIND_BY_IDS](ids, opts);
    };
    Model.all = function (opts) {
        if (opts === void 0) { opts = {}; }
        return this._store.getters[this._path + "/" + Getters.ALL](opts);
    };
    Model.add = function (item) {
        return this._store.dispatch(this._path + "/" + Actions.ADD, item);
    };
    Model.addAll = function (items) {
        return this._store.dispatch(this._path + "/" + Actions.ADD_ALL, items);
    };
    Model.id = "id";
    return Model;
}());

function normalize(raw, entityName, visited, entities, depth) {
    var e_1, _a;
    if (visited === void 0) { visited = new Map(); }
    if (entities === void 0) { entities = createObject({}); }
    if (depth === void 0) { depth = 0; }
    var resolvedEntityName = Array.isArray(entityName) ? entityName[0] : entityName;
    var schema = nameModelMap.get(resolvedEntityName);
    var fields = schema._fields;
    var normalized = {};
    var result;
    if (raw == null) {
        result = null;
    }
    else if (Array.isArray(raw)) {
        result = raw.map(function (r) {
            var result = normalize(r, resolvedEntityName, visited, entities, depth + 1).result;
            return result;
        }).filter(function (id) { return id != null; });
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
                    if (key in fields && fields[key].isRelationship) {
                        var result_1 = normalize(value, fields[key].entity, visited, entities, depth + 1).result;
                        normalized[key] = result_1;
                    }
                    else {
                        normalized[key] = value;
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
            if (!(resolvedEntityName in entities)) {
                entities[resolvedEntityName] = createObject({});
            }
            entities[resolvedEntityName][id] = __assign(__assign({}, entities[resolvedEntityName][id]), normalized);
        }
    }
    return {
        result: result,
        entities: entities
    };
}

var sum = require('hash-sum');
function generateModuleName(namespace, key) {
    namespace = namespace || '';
    var chunks = namespace.split('/');
    chunks.push(key);
    return chunks.join('/');
}
function createModule(schema, keyMap, options, store) {
    var _a, _b, _c;
    Object.defineProperties(schema, {
        _path: {
            value: keyMap[schema.entityName]
        },
        _store: {
            value: store
        }
    });
    return {
        namespaced: true,
        state: function () { return ({}); },
        mutations: (_a = {},
            _a[Mutations.ADD] = function (state, _a) {
                var id = _a.id, entity = _a.entity;
                Vue__default['default'].set(state, id, __assign(__assign({}, state[id]), entity));
            },
            _a[Mutations.SET_PROP] = function (state, _a) {
                var id = _a.id, key = _a.key, value = _a.value;
                if (state[id] == null) {
                    throw new Error('Entity does not exist');
                }
                Vue__default['default'].set(state[id], key, value);
            },
            _a),
        actions: (_b = {},
            _b[Actions.ADD] = function (ctx, item) {
                var _a = normalize(item, schema.entityName), entities = _a.entities, result = _a.result;
                Object.entries(entities).forEach(function (_a) {
                    var _b = __read(_a, 2), entityName = _b[0], entities = _b[1];
                    Object.entries(entities).forEach(function (_a) {
                        var _b = __read(_a, 2), id = _b[0], entity = _b[1];
                        if (!entity) {
                            return;
                        }
                        ctx.commit(keyMap[entityName] + "/" + Mutations.ADD, { id: id, entity: entity }, { root: true });
                    });
                });
                return result;
            },
            _b[Actions.ADD_RELATED] = function (_a, _b) {
                var _c;
                var state = _a.state, dispatch = _a.dispatch, getters = _a.getters;
                var id = _b.id, related = _b.related, data = _b.data;
                if (!(related in schema._fields) && schema._fields[related].isRelationship) {
                    throw new Error("Unknown Relationship: [" + related + "]");
                }
                var item = getters[Getters.FIND](id, { load: [related] });
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
                        _c)
                });
            },
            _b[Actions.REMOVE_RELATED] = function (_a, _b) {
                var _c;
                var dispatch = _a.dispatch, getters = _a.getters;
                var id = _b.id, related = _b.related, relatedId = _b.relatedId;
                if (!(related in schema._fields) && schema._fields[related].isRelationship) {
                    throw new Error("Unknown Relationship: [" + related + "]");
                }
                var ids = Array.isArray(id) ? id : [id];
                var items = getters[Getters.FIND_BY_IDS](ids, { load: [related] });
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
                                _a)
                        });
                    }));
                }
                else {
                    return dispatch(Actions.UPDATE, {
                        id: id,
                        data: (_c = {},
                            _c[related] = null,
                            _c)
                    });
                }
            },
            _b[Actions.ADD_ALL] = function (_a, items) {
                var dispatch = _a.dispatch;
                return Promise.all(items.map(function (item) { return dispatch(Actions.ADD, item); }));
            },
            _b[Actions.UPDATE] = function (_a, _b) {
                var getters = _a.getters, dispatch = _a.dispatch;
                var id = _b.id, data = _b.data;
                if (id === null || id === undefined) {
                    throw new Error('Id to perform update must be defined');
                }
                var ids = Array.isArray(id) ? id : [id];
                var items = getters[Getters.FIND_BY_IDS](ids).filter(identity);
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
                    var idHasChanged = oldIds.some(function (id, index) { return id !== newIds_1[index]; });
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
                return dispatch(Actions.ADD_ALL, newItems);
            },
            _b),
        getters: (_c = {},
            _c[Getters.GET_RAW] = function (state) { return function (id) { return state[id]; }; },
            _c[Getters.FIND] = function (state, getters, rootState, rootGetters) { return function (id, opts) {
                if (opts === void 0) { opts = {}; }
                var data = getters[Getters.GET_RAW](id);
                if (!data) {
                    return;
                }
                var load = relations(opts.load, schema._fields);
                return resolveModel(schema, data, { load: load, connected: true });
            }; },
            _c[Getters.FIND_BY_IDS] = function (state, getters) {
                return function (ids, opts) {
                    if (ids === void 0) { ids = []; }
                    if (opts === void 0) { opts = {}; }
                    return ids.map(function (id) { return getters[Getters.FIND](id, opts); }).filter(identity);
                };
            },
            _c[Getters.ALL] = function (state, getters) { return function (opts) {
                if (opts === void 0) { opts = {}; }
                return getters[Getters.FIND_BY_IDS](Object.keys(state), opts);
            }; },
            _c)
    };
}
var modelCache = {};
function resolveModel(schema, rawData, options) {
    var _a;
    var _b;
    if (options === void 0) { options = {}; }
    var id = getIdValue(rawData, schema);
    var entity = schema.entityName;
    var load = options === null || options === void 0 ? void 0 : options.load;
    return (_a = modelCache[_b = sum({ id: id, entity: entity, load: load })]) !== null && _a !== void 0 ? _a : (modelCache[_b] = new schema(rawData, options));
}

function Field(options) {
    if (options === void 0) { options = {}; }
    return function (target, propname) {
        var constructor = target.constructor;
        if (constructor._fields == null) {
            constructor._fields = createObject({});
        }
        var definition = new FieldDefinition();
        if (typeof options == 'string') {
            definition.setEntity(options);
        }
        else if (Array.isArray(options)) {
            definition.setEntity(options[0]).setList(true);
        }
        else {
            definition = new FieldDefinition(options);
        }
        constructor._fields[propname] = definition.lock();
    };
}

var defaultPluginOptions = {
    schemas: [],
    namespace: 'database'
};
function generateDatabasePlugin(options) {
    options = __assign(__assign({}, defaultPluginOptions), options);
    return function (store) {
        console.log('registering plugin');
        var schemaModuleNameMap = {};
        options.schemas.forEach(function (schema) {
            schemaModuleNameMap[schema.entityName] = generateModuleName(options.namespace, schema.entityName);
            registerSchema(schema);
        });
        // resolveCyclicDependencies();
        var modules = {};
        options.schemas.forEach(function (schema) {
            modules[schema.entityName] = createModule(schema, schemaModuleNameMap, options, store);
        });
        if (options.namespace) {
            store.registerModule(options.namespace, {
                namespaced: true,
                modules: modules
            });
        }
        else {
            Object.entries(modules).forEach(function (_a) {
                var _b = __read(_a, 2), name = _b[0], mod = _b[1];
                return store.registerModule(name, mod);
            });
        }
    };
}

exports.Field = Field;
exports.Model = Model;
exports.generateDatabasePlugin = generateDatabasePlugin;
