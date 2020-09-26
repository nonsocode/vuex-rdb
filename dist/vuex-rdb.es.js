import { schema, normalize } from 'normalizr';
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

var isList = function (definition) { return Array.isArray(definition); };
function relations(relatives) {
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
            var t = result_1;
            var paths = relative.split('.');
            for (var i = 0; i < paths.length; i++) {
                if (paths[i] === '*' || t['*']) {
                    t['*'] = true;
                    break;
                }
                t[paths[i]] = t[paths[i]] || {};
                t = t[paths[i]];
            }
        });
        return result_1;
    }
}
function getRelationshipSchema(relationship) {
    return isList(relationship) ? relationship[0] : relationship;
}

var entitySchemas = new Map();
var pendingItems = new Map();
function dependOn(dependant, dependee, keyName) {
    var innerMap = pendingItems.has(dependant) ? pendingItems.get(dependant) : new Map();
    if (dependee) {
        var keySet = innerMap.has(dependee) ? innerMap.get(dependee) : new Set();
        keySet.add(keyName);
        innerMap.set(dependee, keySet);
    }
    pendingItems.set(dependant, innerMap);
}
function registerSchema(schema) {
    if (entitySchemas.has(schema)) {
        return 'registered';
    }
    var definitions = Object.entries(schema.relationships || {});
    dependOn(schema);
    if (definitions.length) {
        definitions.forEach(function (_a) {
            var _b = __read(_a, 2), key = _b[0], dependee = _b[1];
            dependOn(schema, isList(dependee) ? dependee[0] : dependee, key);
        });
    }
}
function resolveCyclicDependencies() {
    pendingItems.forEach(function (value, dep) { return cyclicResolve(dep, entitySchemas); });
}
function cyclicResolve(modelSchema, result) {
    if (result.has(modelSchema))
        return;
    var entity = new schema.Entity(modelSchema.entityName, {}, {
        idAttribute: modelSchema.id || 'id'
    });
    result.set(modelSchema, entity);
    pendingItems.get(modelSchema).forEach(function (keys, dependency) {
        cyclicResolve(dependency, result);
        keys.forEach(function (key) {
            var _a;
            var relationshipData = modelSchema.relationships[key];
            var relationshipSchema = result.get(getRelationshipSchema(relationshipData));
            var childEnt = isList(relationshipData) ? [relationshipSchema] : relationshipSchema;
            entity.define((_a = {},
                _a[key] = childEnt,
                _a));
        });
    });
}

var Mutations;
(function (Mutations) {
    Mutations["ADD"] = "_ADD";
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
    Getters["FIND_BY_IDS"] = "findByIds";
    Getters["ALL"] = "all";
})(Getters || (Getters = {}));

var cacheNames = ['_dataCache', '_relationshipCache', '_changes'];
var internal = __spread(cacheNames, ['_options']);
var getCacheName = function (target, key) { return key in target.constructor.relationships ? '_relationshipCache' : '_dataCache'; };
var internalSet = function (target, key, value) {
    target[getCacheName(target, key)] = value;
};
var hydrate = function (husk, fountain) {
    if (fountain === void 0) { fountain = {}; }
    Object.entries(fountain).forEach(function (_a) {
        var _b = __read(_a, 2), key = _b[0], value = _b[1];
        internalSet(husk, key, value);
    });
};
function getId(model, schema) {
    return isFunction(schema.id) ? schema.id(model, null, null) : model[schema.id];
}
function setCurrentPropsFromRaw(model, data, options) {
    if (data === void 0) { data = {}; }
    if (options === void 0) { options = {}; }
    var schema = model.constructor;
    Object.entries(data).forEach(function (_a) {
        var _b;
        var _c = __read(_a, 2), key = _c[0], value = _c[1];
        var isRelationship = key in schema.relationships;
        if (!isRelationship) {
            model._dataCache[key] = value;
        }
        else {
            var relationshipDef_1 = schema.relationships[key];
            var load = __assign({}, (_b = options === null || options === void 0 ? void 0 : options.load) === null || _b === void 0 ? void 0 : _b[key]);
            model._relationshipCache[key] = isList(relationshipDef_1)
                ? getRelationshipSchema(relationshipDef_1).findByIds(value.map(function (v) { return getId(v, getRelationshipSchema(relationshipDef_1)); }), { load: load })
                : value && relationshipDef_1.find(getId(value, getRelationshipSchema(relationshipDef_1)), { load: load });
        }
    });
}
var Model = /** @class */ (function () {
    function Model(data, opts) {
        if (opts === void 0) { opts = {}; }
        this._options = {};
        Object.defineProperties(this, __assign(__assign({}, Object.fromEntries(cacheNames.map(function (cacheName) { return [cacheName, { value: {} }]; }))), { _options: { value: __assign({}, opts), enumerable: false } }));
        if (data) {
            hydrate(this, data);
        }
        // return new Proxy<Model>(this, {
        //   get: externalGet,
        //   set: externalSet,
        //   enumerate: enumerator,
        //   ownKeys: enumerator,
        // })
    }
    Object.defineProperty(Model, "relationships", {
        get: function () {
            return {};
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Model.prototype, "_id", {
        get: function () {
            return getId(this, this.constructor);
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
                        .then(function (ids) {
                        setCurrentPropsFromRaw(_this, data, _this._options);
                        return ids;
                    })];
            });
        });
    };
    Model.prototype.$save = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.$update(__assign({}, this._changes))];
            });
        });
    };
    Model.prototype.$addRelated = function (related, data) {
        return __awaiter(this, void 0, void 0, function () {
            var constructor;
            var _this = this;
            return __generator(this, function (_a) {
                constructor = this.constructor;
                return [2 /*return*/, constructor._store
                        .dispatch(constructor._path + "/addRelated", {
                        id: this._id,
                        related: related,
                        data: data
                    })
                        .then(function (ids) {
                        var _a;
                        if (['*', related].some(function (prop) { var _a, _b; return (_b = (_a = _this._options) === null || _a === void 0 ? void 0 : _a.load) === null || _b === void 0 ? void 0 : _b[prop]; })) {
                            var relationshipDef_2 = _this.constructor.relationships[related];
                            var shouldBeArray_1 = isList(relationshipDef_2);
                            data = shouldBeArray_1
                                ? mergeUnique((_this[related] || []).concat(!Array.isArray(data) ? [data] : data), function (item) {
                                    return getId(item, shouldBeArray_1 ? relationshipDef_2[0] : relationshipDef_2);
                                })
                                : data;
                            setCurrentPropsFromRaw(_this, (_a = {}, _a[related] = data, _a), _this._options);
                        }
                        return ids;
                    })];
            });
        });
    };
    Model.prototype.$fresh = function () {
        return __awaiter(this, void 0, void 0, function () {
            var newModel;
            return __generator(this, function (_a) {
                newModel = this.constructor.find(this._id, this._options);
                hydrate(this, newModel);
                return [2 /*return*/, this];
            });
        });
    };
    Model.prototype.$changes = function () {
        return __assign({}, this._changes);
    };
    Model.prototype.$resetChanges = function () {
        var _this = this;
        Object.keys(this._changes).forEach(function (key) {
            delete _this._changes[key];
        });
    };
    Model.prototype.$removeRelated = function (related, relatedId) {
        return __awaiter(this, void 0, void 0, function () {
            var constructor;
            var _this = this;
            return __generator(this, function (_a) {
                constructor = this.constructor;
                return [2 /*return*/, constructor._store
                        .dispatch(constructor._path + "/removeRelated", {
                        id: this._id,
                        related: related,
                        relatedId: relatedId
                    })
                        .then(function (ids) {
                        var _a;
                        if (['*', related].some(function (prop) { var _a, _b; return (_b = (_a = _this._options) === null || _a === void 0 ? void 0 : _a.load) === null || _b === void 0 ? void 0 : _b[prop]; })) {
                            var relationshipDef_3 = _this.constructor.relationships[related];
                            var data = void 0;
                            if (isList(relationshipDef_3)) {
                                if (!relatedId) {
                                    data = [];
                                }
                                else {
                                    var items = _this[related];
                                    var ids_1 = Array.isArray(relatedId) ? relatedId : [relatedId];
                                    data = items
                                        ? items.filter(function (item) { return !ids_1.includes(getId(item, getRelationshipSchema(relationshipDef_3))); })
                                        : [];
                                }
                            }
                            else {
                                data = null;
                            }
                            setCurrentPropsFromRaw(_this, (_a = {}, _a[related] = data, _a), _this._options);
                        }
                        return ids;
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
    return Model;
}());

function generateModuleName(namespace, key) {
    namespace = namespace || '';
    var chunks = namespace.split('/');
    chunks.push(key);
    return chunks.join('/');
}
function createModule(schema, keyMap, options, store) {
    var _a, _b, _c;
    var entitySchema = entitySchemas.get(schema);
    var relationKeys = Object.keys(schema.relationships || {});
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
        state: function () { return ({
            data: {}
        }); },
        mutations: (_a = {},
            _a[Mutations.ADD] = function (state, _a) {
                var id = _a.id, entity = _a.entity;
                Vue.set(state, id, __assign(__assign({}, state[id]), entity));
            },
            _a),
        actions: (_b = {},
            _b[Actions.ADD] = function (ctx, item) {
                var _a = normalize(item, entitySchema), entities = _a.entities, result = _a.result;
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
                if (!(related in schema.relationships)) {
                    throw new Error("Unknown Relationship: [" + related + "]");
                }
                var item = getters[Getters.FIND](id, { load: [related] });
                if (!item) {
                    throw new Error("The item doesn't exist");
                }
                var relationshipDef = schema.relationships[related];
                if (isList(relationshipDef)) {
                    var items = (Array.isArray(data) ? data : [data]).filter(identity);
                    data = item[related] || [];
                    data = mergeUnique(data.concat(items), function (item) { return getId(item, getRelationshipSchema(relationshipDef)); });
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
                if (!(related in schema.relationships)) {
                    throw new Error("Unknown Relationship: [" + related + "]");
                }
                var ids = Array.isArray(id) ? id : [id];
                var items = getters[Getters.FIND_BY_IDS](ids, { load: [related] });
                if (items.length === 0) {
                    console.warn('Invalid id Provided');
                    return;
                }
                var relationshipDef = schema.relationships[related];
                var relatedSchema = getRelationshipSchema(relationshipDef);
                if (isList(relationshipDef)) {
                    var relatedIds_1 = relatedId ? (Array.isArray(relatedId) ? relatedId : [relatedId]) : [];
                    return Promise.all(items.map(function (item) {
                        var _a;
                        var relatedItems = relatedIds_1.length ? item[related] || [] : [];
                        return dispatch(Actions.UPDATE, {
                            id: id,
                            data: (_a = {},
                                _a[related] = relatedItems.filter(function (item) { return !relatedIds_1.includes(getId(item, relatedSchema)); }),
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
                    var oldIds = items.map(function (item) { return getId(item, schema); });
                    var newIds_1 = newItems.map(function (item) { return getId(item, schema); });
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
            _c[Getters.FIND] = function (state, getters, rootState, rootGetters) { return function (id, opts) {
                if (opts === void 0) { opts = {}; }
                var data = state.data[id];
                if (!data) {
                    return;
                }
                var loadable = relations(opts.load);
                var relatedData;
                if (Object.keys(loadable).includes('*')) {
                    relatedData = relationKeys.reduce(function (relatedData, key) {
                        var _a = relationGetters(data, key, schema, keyMap, rootGetters), getter = _a.getter, identifier = _a.identifier;
                        relatedData[key] = getter(identifier, __assign(__assign({}, opts), { load: [] }));
                        return relatedData;
                    }, {});
                }
                else {
                    relatedData = Object.entries(loadable)
                        .filter(function (_a) {
                        var _b = __read(_a, 1), key = _b[0];
                        return key in schema.relationships;
                    })
                        .reduce(function (relatedData, _a) {
                        var _b = __read(_a, 2), key = _b[0], value = _b[1];
                        var _c = relationGetters(data, key, schema, keyMap, rootGetters), getter = _c.getter, identifier = _c.identifier;
                        relatedData[key] = getter(identifier, __assign(__assign({}, opts), { load: value }));
                        return relatedData;
                    }, {});
                }
                var dataWithoutRelationships = Object.entries(data).reduce(function (data, _a) {
                    var _b = __read(_a, 2), key = _b[0], value = _b[1];
                    if (!(key in schema.relationships)) {
                        data[key] = value;
                    }
                    return data;
                }, {});
                return new schema(__assign(__assign({}, dataWithoutRelationships), relatedData), { load: loadable });
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
                return getters[Getters.FIND_BY_IDS](Object.keys(state.data), opts);
            }; },
            _c)
    };
}
function relationGetters(data, key, schema, keyMap, rootGetters) {
    var relDefinition = schema.relationships[key];
    var relatedSchema = getRelationshipSchema(relDefinition);
    var getterType = isList(relDefinition) ? Getters.FIND_BY_IDS : Getters.FIND;
    var getterPath = keyMap[relatedSchema.entityName] + "/" + getterType;
    var getter = rootGetters[getterPath];
    var identifier = data[key];
    if ([null, undefined].includes(identifier) && isList(relDefinition)) {
        identifier = [];
    }
    return { getter: getter, identifier: identifier };
}

var defaultPluginOptions = {
    schemas: [],
    namespace: 'database'
};
function generateDatabasePlugin(options) {
    options = __assign(__assign({}, defaultPluginOptions), options);
    return function (store) {
        var schemaModuleNameMap = {};
        options.schemas.forEach(function (schema) {
            schemaModuleNameMap[schema.entityName] = generateModuleName(options.namespace, schema.entityName);
            registerSchema(schema);
        });
        resolveCyclicDependencies();
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

export { Model, generateDatabasePlugin };
