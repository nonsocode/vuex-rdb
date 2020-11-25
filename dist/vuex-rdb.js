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

var extendStatics = function (d, b) {
  extendStatics =
    Object.setPrototypeOf ||
    ({ __proto__: [] } instanceof Array &&
      function (d, b) {
        d.__proto__ = b;
      }) ||
    function (d, b) {
      for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
    };
  return extendStatics(d, b);
};

function __extends(d, b) {
  extendStatics(d, b);
  function __() {
    this.constructor = d;
  }
  d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
}

var __assign = function () {
  __assign =
    Object.assign ||
    function __assign(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
      return t;
    };
  return __assign.apply(this, arguments);
};

function __decorate(decorators, target, key, desc) {
  var c = arguments.length,
    r = c < 3 ? target : desc === null ? (desc = Object.getOwnPropertyDescriptor(target, key)) : desc,
    d;
  if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
    r = Reflect.decorate(decorators, target, key, desc);
  else
    for (var i = decorators.length - 1; i >= 0; i--)
      if ((d = decorators[i])) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P
      ? value
      : new P(function (resolve) {
          resolve(value);
        });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator['throw'](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}

function __generator(thisArg, body) {
  var _ = {
      label: 0,
      sent: function () {
        if (t[0] & 1) throw t[1];
        return t[1];
      },
      trys: [],
      ops: [],
    },
    f,
    y,
    t,
    g;
  return (
    (g = { next: verb(0), throw: verb(1), return: verb(2) }),
    typeof Symbol === 'function' &&
      (g[Symbol.iterator] = function () {
        return this;
      }),
    g
  );
  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }
  function step(op) {
    if (f) throw new TypeError('Generator is already executing.');
    while (_)
      try {
        if (
          ((f = 1),
          y &&
            (t = op[0] & 2 ? y['return'] : op[0] ? y['throw'] || ((t = y['return']) && t.call(y), 0) : y.next) &&
            !(t = t.call(y, op[1])).done)
        )
          return t;
        if (((y = 0), t)) op = [op[0] & 2, t.value];
        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;
          case 4:
            _.label++;
            return { value: op[1], done: false };
          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;
          case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;
          default:
            if (!((t = _.trys), (t = t.length > 0 && t[t.length - 1])) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }
            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
              _.label = op[1];
              break;
            }
            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            if (t[2]) _.ops.pop();
            _.trys.pop();
            continue;
        }
        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    if (op[0] & 5) throw op[1];
    return { value: op[0] ? op[1] : void 0, done: true };
  }
}

function __values(o) {
  var s = typeof Symbol === 'function' && Symbol.iterator,
    m = s && o[s],
    i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === 'number')
    return {
      next: function () {
        if (o && i >= o.length) o = void 0;
        return { value: o && o[i++], done: !o };
      },
    };
  throw new TypeError(s ? 'Object is not iterable.' : 'Symbol.iterator is not defined.');
}

function __read(o, n) {
  var m = typeof Symbol === 'function' && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o),
    r,
    ar = [],
    e;
  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = { error: error };
  } finally {
    try {
      if (r && !r.done && (m = i['return'])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }
  return ar;
}

function __spread() {
  for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
  return ar;
}

var identity = function (k) {
  return k;
};
function mergeUnique(items, key) {
  var keyFunction = isFunction(key)
    ? key
    : function (item) {
        return item[key];
      };
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
function isBoolean(arg) {
  return arg === true || arg === false;
}
function isString(string) {
  return typeof string === 'string';
}
function createObject(object) {
  var o = Object.create(null);
  object &&
    Object.entries(object).forEach(function (_a) {
      var _b = __read(_a, 2),
        key = _b[0],
        value = _b[1];
      o[key] = value;
    });
  return o;
}
var get = function (path, obj, defaultVal) {
  if (defaultVal === void 0) {
    defaultVal = undefined;
  }
  var returnable = path.split('.').reduce(function (acc, i) {
    return acc === null ? undefined : acc && acc[i];
  }, obj || createObject());
  return returnable === undefined ? defaultVal : returnable;
};
function hasSeen(item, nodeTree) {
  if (!nodeTree) return false;
  while (nodeTree) {
    if (nodeTree.item == item) return true;
    nodeTree = nodeTree.parentNode;
  }
  return false;
}

var FieldDefinition = /** @class */ (function () {
  function FieldDefinition(options) {
    if (options === void 0) {
      options = {};
    }
    this._default = isFunction(options) ? options() : options.default;
  }
  Object.defineProperty(FieldDefinition.prototype, 'default', {
    get: function () {
      return isFunction(this._default) ? this._default() : this._default;
    },
    enumerable: false,
    configurable: true,
  });
  return FieldDefinition;
})();
var SimpleFieldDefinition = /** @class */ (function (_super) {
  __extends(SimpleFieldDefinition, _super);
  function SimpleFieldDefinition(options) {
    if (options === void 0) {
      options = {};
    }
    return _super.call(this, options) || this;
  }
  return SimpleFieldDefinition;
})(FieldDefinition);

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
  Mutations['ADD_ALL'] = 'ADD_ALL';
  Mutations['PATCH_TEMPS'] = 'PATCH_TEMPS';
  Mutations['SET_PROP'] = 'SET_PROP';
  Mutations['SET_INDEX'] = 'SET_INDEX';
})(Mutations || (Mutations = {}));
var Actions;
(function (Actions) {
  Actions['ADD'] = 'add';
  Actions['ADD_RELATED'] = 'addRelated';
  Actions['REMOVE_RELATED'] = 'removeRelated';
  Actions['UPDATE'] = 'update';
})(Actions || (Actions = {}));
var Getters;
(function (Getters) {
  Getters['FIND'] = 'find';
  Getters['GET_RAW'] = 'getRaw';
  Getters['FIND_BY_IDS'] = 'findByIds';
  Getters['ALL'] = 'all';
  Getters['GET_INDEX'] = 'getIndex';
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
var Relationship = /** @class */ (function (_super) {
  __extends(Relationship, _super);
  function Relationship(factory, parentFactory) {
    var _this = _super.call(this) || this;
    _this.factory = factory;
    _this.parentFactory = parentFactory;
    return _this;
  }
  Object.defineProperty(Relationship.prototype, 'schema', {
    get: function () {
      return this.factory();
    },
    enumerable: false,
    configurable: true,
  });
  Object.defineProperty(Relationship.prototype, 'parentSchema', {
    get: function () {
      var _a;
      return (_a = this.parentFactory) === null || _a === void 0 ? void 0 : _a.call(this);
    },
    enumerable: false,
    configurable: true,
  });
  return Relationship;
})(FieldDefinition);
var ListLike = /** @class */ (function (_super) {
  __extends(ListLike, _super);
  function ListLike() {
    return (_super !== null && _super.apply(this, arguments)) || this;
  }
  return ListLike;
})(Relationship);

var ItemRelationship = /** @class */ (function (_super) {
  __extends(ItemRelationship, _super);
  function ItemRelationship() {
    return (_super !== null && _super.apply(this, arguments)) || this;
  }
  return ItemRelationship;
})(Relationship);

var ListRelationship = /** @class */ (function (_super) {
  __extends(ListRelationship, _super);
  function ListRelationship() {
    return (_super !== null && _super.apply(this, arguments)) || this;
  }
  return ListRelationship;
})(ListLike);

var BelongsToRelationship = /** @class */ (function (_super) {
  __extends(BelongsToRelationship, _super);
  function BelongsToRelationship(schemaFactory, parentSchemaFactory, foreignKey) {
    var _this = _super.call(this, schemaFactory, parentSchemaFactory) || this;
    _this.foreignKey = foreignKey;
    return _this;
  }
  return BelongsToRelationship;
})(Relationship);

var HasManyRelationship = /** @class */ (function (_super) {
  __extends(HasManyRelationship, _super);
  function HasManyRelationship(schemaFactory, parentSchemaFactory, foreignKey) {
    var _this = _super.call(this, schemaFactory, parentSchemaFactory) || this;
    _this.foreignKey = foreignKey;
    return _this;
  }
  return HasManyRelationship;
})(ListLike);

var listLike = function (entityDef) {
  return Array.isArray(entityDef) || entityDef instanceof ListLike;
};
var getRelationshipSchema = function (entityDef) {
  return Array.isArray(entityDef)
    ? entityDef[0]
    : entityDef.prototype instanceof Model
    ? entityDef
    : entityDef instanceof Relationship
    ? entityDef.schema
    : null;
};
function normalize(raw, entityDef, visited, entities, depth) {
  var e_1, _a, e_2, _b;
  var _c;
  if (visited === void 0) {
    visited = new Map();
  }
  if (entities === void 0) {
    entities = new Map();
  }
  var schema = getRelationshipSchema(entityDef);
  var fields = schema._fields;
  var result;
  if (raw == null) {
    result = null;
  } else if (Array.isArray(raw) && listLike(entityDef)) {
    result = raw
      .map(function (r) {
        var result = normalize(r, schema, visited, entities).result;
        return result;
      })
      .filter(function (id) {
        return id != null;
      });
  } else {
    if (visited.has(raw)) {
      result = visited.get(raw);
    } else {
      result = getIdValue(raw, schema);
      visited.set(raw, result);
      if (!entities.has(schema)) {
        entities.set(schema, createObject());
      }
      if (!entities.get(schema)[result]) {
        entities.get(schema)[result] = {};
      }
      var normalized = entities.get(schema)[result];
      var relEntries = [];
      try {
        for (var _d = __values(Object.entries(raw)), _e = _d.next(); !_e.done; _e = _d.next()) {
          var _f = __read(_e.value, 2),
            key = _f[0],
            value = _f[1];
          if (!(key in fields)) continue;
          if (!(fields[key] instanceof Relationship)) {
            normalized[key] = value;
            continue;
          }
          relEntries.push([key, value]);
        }
      } catch (e_1_1) {
        e_1 = { error: e_1_1 };
      } finally {
        try {
          if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
        } finally {
          if (e_1) throw e_1.error;
        }
      }
      var _loop_1 = function (key, value) {
        var fieldDefinition = fields[key];
        var relatedResult = normalize(value, fields[key], visited, entities).result;
        switch (true) {
          case fieldDefinition instanceof ItemRelationship:
          case fieldDefinition instanceof ListRelationship: {
            normalized[key] = relatedResult;
            break;
          }
          case fieldDefinition instanceof HasManyRelationship: {
            var _a = fieldDefinition,
              schema_1 = _a.schema,
              foreignKey_1 = _a.foreignKey;
            (_c = relatedResult) === null || _c === void 0
              ? void 0
              : _c.forEach(function (id) {
                  entities.get(schema_1)[id][foreignKey_1] = result;
                });
            break;
          }
          case fieldDefinition instanceof BelongsToRelationship: {
            var foreignKey = fieldDefinition.foreignKey;
            normalized[foreignKey] = relatedResult;
            break;
          }
        }
      };
      try {
        for (
          var relEntries_1 = __values(relEntries), relEntries_1_1 = relEntries_1.next();
          !relEntries_1_1.done;
          relEntries_1_1 = relEntries_1.next()
        ) {
          var _g = __read(relEntries_1_1.value, 2),
            key = _g[0],
            value = _g[1];
          _loop_1(key, value);
        }
      } catch (e_2_1) {
        e_2 = { error: e_2_1 };
      } finally {
        try {
          if (relEntries_1_1 && !relEntries_1_1.done && (_b = relEntries_1.return)) _b.call(relEntries_1);
        } finally {
          if (e_2) throw e_2.error;
        }
      }
    }
  }
  return {
    result: result,
    entities: entities,
  };
}

function getConstructor(model) {
  return model.constructor;
}
function validateEntry(data, relationship) {
  var schema = relationship.schema;
  return relationship instanceof ListLike
    ? data.every(function (item) {
        return getIdValue(item, schema) != null;
      })
    : getIdValue(data, schema) != null;
}
function normalizeAndStore(store, data, entityDef) {
  var e_1, _a;
  var _b = normalize(data, entityDef),
    entities = _b.entities,
    result = _b.result;
  try {
    for (var _c = __values(entities.entries()), _d = _c.next(); !_d.done; _d = _c.next()) {
      var _e = __read(_d.value, 2),
        schema = _e[0],
        items = _e[1];
      store.commit(schema._namespace + '/' + Mutations.ADD_ALL, { schema: schema, items: items }, { root: true });
    }
  } catch (e_1_1) {
    e_1 = { error: e_1_1 };
  } finally {
    try {
      if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
    } finally {
      if (e_1) throw e_1.error;
    }
  }
  return result;
}
function modelToObject(model, schema, allProps, seen) {
  if (seen === void 0) {
    seen = new Map();
  }
  var object = {};
  seen.set(model, object);
  Object.entries(model).reduce(function (acc, _a) {
    var e_2, _b;
    var _c = __read(_a, 2),
      key = _c[0],
      value = _c[1];
    if (key in schema._fields) {
      var fieldDef = schema._fields[key];
      if (fieldDef instanceof Relationship) {
        var relatedSchema = fieldDef.schema;
        if (value == null) {
          acc[key] = null;
        } else if (Array.isArray(value) && fieldDef instanceof ListLike) {
          var items = [];
          try {
            for (
              var value_1 = __values(value), value_1_1 = value_1.next();
              !value_1_1.done;
              value_1_1 = value_1.next()
            ) {
              var item = value_1_1.value;
              items.push(seen.has(item) ? seen.get(item) : modelToObject(item, relatedSchema, allProps, seen));
            }
          } catch (e_2_1) {
            e_2 = { error: e_2_1 };
          } finally {
            try {
              if (value_1_1 && !value_1_1.done && (_b = value_1.return)) _b.call(value_1);
            } finally {
              if (e_2) throw e_2.error;
            }
          }
          acc[key] = items;
        } else {
          acc[key] = seen.has(value) ? seen.get(value) : modelToObject(value, relatedSchema, allProps, seen);
        }
      } else {
        acc[key] = value;
      }
    }
    return acc;
  }, object);
  return object;
}

function validateItems(items, schema) {
  var e_1, _a;
  try {
    for (var items_1 = __values(items), items_1_1 = items_1.next(); !items_1_1.done; items_1_1 = items_1.next()) {
      var item = items_1_1.value;
      if (getIdValue(item, schema) == null) {
        throw new Error('An item being assigned to this array does not have a valid identifier');
      }
    }
  } catch (e_1_1) {
    e_1 = { error: e_1_1 };
  } finally {
    try {
      if (items_1_1 && !items_1_1.done && (_a = items_1.return)) _a.call(items_1);
    } finally {
      if (e_1) throw e_1.error;
    }
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
      var _schema = this._schema;
      validateItems(args, _schema);
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
      var _schema = this._schema;
      var _a = __read(args),
        items = _a.slice(2);
      items.length && validateItems(items, _schema);
      method.apply(this, args);
    };
  };
}
var ModelArray = /** @class */ (function (_super) {
  __extends(ModelArray, _super);
  function ModelArray() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    var _this = _super.apply(this, __spread(args)) || this;
    Object.setPrototypeOf(_this, ModelArray.prototype);
    return _this;
  }
  ModelArray.prototype._init = function (context, key, items) {
    Object.defineProperties(this, {
      _context: { value: context },
      _key: { value: key },
      _store: { value: getConstructor(context)._store },
      _contextSchema: { value: getConstructor(context) },
      _schema: { value: getConstructor(context)._fields[key].schema },
    });
    _super.prototype.push.apply(this, items);
    return this;
  };
  ModelArray.prototype.push = function () {
    var _a;
    var items = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      items[_i] = arguments[_i];
    }
    normalizeAndStore(
      this._store,
      __assign(__assign({}, this._context), ((_a = {}), (_a[this._key] = __spread(this._allForContext(), items)), _a)),
      this._contextSchema
    );
    _super.prototype.splice.apply(this, __spread([0, this.length], this._context[this._key]));
    return this.length;
  };
  ModelArray.prototype.pop = function () {
    var removed = _super.prototype.pop.call(this);
    this._remove([removed]);
    return removed;
  };
  ModelArray.prototype.unshift = function () {
    var _a;
    var items = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      items[_i] = arguments[_i];
    }
    normalizeAndStore(
      this._store,
      __assign(__assign({}, this._context), ((_a = {}), (_a[this._key] = __spread(this._allForContext(), items)), _a)),
      this._contextSchema
    );
    _super.prototype.splice.apply(this, __spread([0, this.length], this._context[this._key]));
    return this.length;
  };
  ModelArray.prototype.shift = function () {
    var removed = _super.prototype.shift.call(this);
    this._remove([removed]);
    return removed;
  };
  ModelArray.prototype.splice = function () {
    var _a;
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    var _b = __read(args),
      start = _b[0],
      count = _b[1],
      rest = _b.slice(2);
    var result = args.length === 0 ? [] : _super.prototype.splice.apply(this, __spread([start, count], rest));
    this._remove(result);
    normalizeAndStore(
      this._store,
      __assign(__assign({}, this._context), ((_a = {}), (_a[this._key] = __spread(this._allForContext(), rest)), _a)),
      this._contextSchema
    );
    return result;
  };
  ModelArray.prototype.toPlainArray = function () {
    return __spread(this).map(function (item) {
      return item instanceof Model ? item.$toObject() : item;
    });
  };
  ModelArray.prototype._remove = function (items) {
    if (!items.length) return;
    var _a = this,
      schema = _a._schema,
      _b = this._key,
      relationship = _a._contextSchema._fields[_b];
    var allItems = this._allForContext();
    var itemIds = items.map(function (item) {
      return getIdValue(item, schema);
    });
    switch (true) {
      case relationship instanceof ListRelationship: {
        var idsRemaining = allItems
          .map(function (item) {
            return getIdValue(item, schema);
          })
          .filter(function (id) {
            return !itemIds.includes(id);
          });
        this._mutateContext(idsRemaining);
        break;
      }
      case relationship instanceof HasManyRelationship: {
        schema.findByIds(itemIds).forEach(function (item) {
          return (item[relationship.foreignKey] = null);
        });
        break;
      }
    }
  };
  ModelArray.prototype._allForContext = function () {
    var _a;
    return (
      ((_a = this._contextSchema.find(this._context._id)) === null || _a === void 0 ? void 0 : _a[this._key]) || []
    );
  };
  ModelArray.prototype._mutateContext = function (value) {
    this._store.commit(this._contextSchema._namespace + '/' + Mutations.SET_PROP, {
      id: this._context._id,
      key: this._key,
      value: value,
      schema: this._contextSchema,
    });
  };
  __decorate([validate()], ModelArray.prototype, 'push', null);
  __decorate([validate()], ModelArray.prototype, 'unshift', null);
  __decorate([validateSplice()], ModelArray.prototype, 'splice', null);
  return ModelArray;
})(Array);
window.ModelArray = ModelArray;

var Query = /** @class */ (function () {
  function Query() {
    this.whereAnds = [];
    this.whereOrs = [];
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
    var wheres = type == 'and' ? this.whereAnds : this.whereOrs;
    switch (args.length) {
      case 1:
        if (!isFunction(args[0]) && !isBoolean(args[0])) {
          throw new Error('Argument should be a function or boolean');
        }
        if (isBoolean(args[0])) {
          wheres.push({
            operand: args[0],
          });
        } else {
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
  };
  return Query;
})();

var ContextualQuery = /** @class */ (function (_super) {
  __extends(ContextualQuery, _super);
  function ContextualQuery(context) {
    var _this = _super.call(this) || this;
    _this.context = context;
    return _this;
  }
  ContextualQuery.prototype.matchItem = function (item) {
    if (!this.whereAnds.length && !this.whereOrs.length) return true;
    var result = [];
    var comparator = getComparator(item);
    result.push(!!(this.whereAnds.length && this.whereAnds.every(comparator)));
    result.push(!!(this.whereOrs.length && this.whereOrs.some(comparator)));
    return result.some(identity);
  };
  ContextualQuery.prototype.get = function () {
    return this.matchItem(this.context);
  };
  return ContextualQuery;
})(Query);

var getComparator = function (item) {
  return function (where) {
    if (isFunction(where.key)) {
      var query = new ContextualQuery(item);
      var result = where.key.call(null, query, item);
      if (typeof result == 'boolean') {
        return result;
      }
      return query.get();
    } else if (isString(where.key) && isFunction(where.value)) {
      var value = get(where.key, item);
      var query = new ContextualQuery(value);
      var result = where.value.call(null, query, value);
      if (typeof result == 'boolean') return result;
      return query.get();
    } else if (isBoolean(where.operand)) {
      return where.operand;
    } else if (isString(where.key) && !isFunction(where.value)) {
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
  };
};
var addToLoads = function (key, relationship, originalLoad, newLoads) {
  if (originalLoad.has(key)) {
    newLoads.push(originalLoad.getLoad(key));
  } else {
    var newLoad = new Load(relationship);
    originalLoad.addLoad(key, newLoad);
    newLoads.push(newLoad);
  }
};
function getLoads(loads, key) {
  var e_1, _a;
  var newLoads = [];
  var _loop_1 = function (load) {
    var schema = load.getRelationship().schema;
    if (key === '*') {
      Object.entries(schema._fields)
        .filter(function (_a) {
          var _b = __read(_a, 2),
            fieldDef = _b[1];
          return fieldDef instanceof Relationship;
        })
        .forEach(function (_a) {
          var _b = __read(_a, 2),
            key = _b[0],
            value = _b[1];
          addToLoads(key, value, load, newLoads);
        });
    } else if (!schema._fields[key] || !(schema._fields[key] instanceof Relationship)) {
      console.warn('[' + key + '] is not a relationship');
    } else {
      addToLoads(key, schema._fields[key], load, newLoads);
    }
  };
  try {
    for (var loads_1 = __values(loads), loads_1_1 = loads_1.next(); !loads_1_1.done; loads_1_1 = loads_1.next()) {
      var load = loads_1_1.value;
      _loop_1(load);
    }
  } catch (e_1_1) {
    e_1 = { error: e_1_1 };
  } finally {
    try {
      if (loads_1_1 && !loads_1_1.done && (_a = loads_1.return)) _a.call(loads_1);
    } finally {
      if (e_1) throw e_1.error;
    }
  }
  return newLoads;
}

var LoadQuery = /** @class */ (function (_super) {
  __extends(LoadQuery, _super);
  function LoadQuery(load) {
    var _this = _super.call(this) || this;
    _this.load = load;
    _this.whereHasAnds = [];
    _this.whereHasOrs = [];
    return _this;
  }
  LoadQuery.prototype.with = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    switch (args.length) {
      case 1:
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
})(ContextualQuery);

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
    if (this.conditions.size == 0 || data == null) return data;
    var conditions = __spread(this.conditions);
    if (this.relationship instanceof ListLike) {
      return data.filter(function (item) {
        return conditions.some(function (condition) {
          return condition.matchItem(item);
        });
      });
    } else if (
      conditions.some(function (condition) {
        return condition.matchItem(data);
      })
    ) {
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
      var _b = __read(_a, 2),
        key = _b[0],
        val = _b[1];
      var segments = key.split('.');
      var loads = segments.reduce(
        function (loads, segment) {
          return getLoads(loads, segment);
        },
        [_this]
      );
      loads.forEach(function (load) {
        if (isFunction(val)) {
          var query = new LoadQuery(load);
          val.call(null, query);
          load.addCondition(query);
        }
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
    var _a = __read(args, 2),
      firstArg = _a[0],
      secondArg = _a[1];
    switch (args.length) {
      case 1:
        if (Array.isArray(firstArg)) {
          firstArg.forEach(function (item) {
            return (rawLoads[item] = true);
          });
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
  };
  return Load;
})();

var ModelQuery = /** @class */ (function (_super) {
  __extends(ModelQuery, _super);
  function ModelQuery(schema) {
    var _this = _super.call(this, null) || this;
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
    var _this = this;
    if (!this.load) {
      this.load = new Load(
        new ItemRelationship(function () {
          return _this.schema;
        })
      );
    }
    return this.load;
  };
  ModelQuery.prototype.get = function () {
    var _this = this;
    var items = this.schema.all();
    items = items.filter(function (item) {
      return _this.matchItem(item);
    });
    if (items.length) {
      if (this.withArgs.length) {
        this.initLoad();
        this.withArgs.forEach(function (_a) {
          var _b = __read(_a, 2),
            first = _b[0],
            second = _b[1];
          _super.prototype.with.call(_this, first, second);
        });
      }
      items = items.map(function (item) {
        return _this.schema.find(getIdValue(item, _this.schema), { load: _this.load });
      });
    }
    return items;
  };
  return ModelQuery;
})(LoadQuery);

function BelongsTo(factory, foreignKey) {
  return function (target, propName) {
    var constructor = target.constructor;
    if (constructor._fields == null) {
      constructor._fields = createObject();
    }
    if (propName in constructor._fields) {
      return;
    }
    constructor._fields[propName] = BelongsTo.define(
      factory,
      function () {
        return constructor;
      },
      foreignKey
    );
  };
}
BelongsTo.define = function (factory, parentFactory, foreignKey) {
  return new BelongsToRelationship(factory, parentFactory, foreignKey);
};

function HasMany(factory, foreignKey) {
  return function (target, propName) {
    var constructor = target.constructor;
    if (constructor._fields == null) {
      constructor._fields = createObject();
    }
    if (propName in constructor._fields) {
      return;
    }
    constructor._fields[propName] = HasMany.define(
      factory,
      function () {
        return constructor;
      },
      foreignKey
    );
  };
}
HasMany.define = function (factory, parentFactory, foreignKey) {
  return new HasManyRelationship(factory, parentFactory, foreignKey);
};

var cacheNames = ['data', 'relationship'];
var getCacheName = function (isRelationship) {
  return cacheNames[isRelationship ? 1 : 0];
};
var parseIfLiteral = function (id, schema) {
  return ['string', 'number'].includes(typeof id) ? schema.find(id) : id;
};
function cacheDefaults(model, overrides) {
  if (overrides === void 0) {
    overrides = {};
  }
  Object.entries(getConstructor(model)._fields).forEach(function (_a) {
    var _b;
    var _c = __read(_a, 2),
      key = _c[0],
      definition = _c[1];
    model._caches[getCacheName(definition instanceof Relationship)][key] =
      (_b = overrides[key]) !== null && _b !== void 0 ? _b : definition.default;
  });
}
function persistUnconnected(target, key, value, relationship) {
  if (relationship) {
    var Related = relationship.schema;
    value = parseIfLiteral(value, Related);
    if (relationship instanceof ListLike && value != null) {
      value = Array.isArray(value) ? value : [value].filter(identity);
    }
  }
  Vue.set(target._caches[getCacheName(!!relationship)], key, value);
}
function persistConnected(target, key, value, relationship, schema) {
  var _a, _b;
  var store = schema._store,
    path = schema._namespace,
    id = schema.id;
  if (relationship) {
    var Related = relationship.schema;
    value = parseIfLiteral(value, Related);
    if (relationship instanceof ListLike && value != null) {
      value = Array.isArray(value) ? value : [value].filter(identity);
    }
    if (value != null) {
      if (!validateEntry(value, relationship)) {
        throw new Error('An item being assigned to the property [' + key + '] does not have a valid identifier');
      }
    }
    normalizeAndStore(store, __assign(__assign({}, target), ((_a = {}), (_a[key] = value), _a)), schema);
  } else {
    if (isFunction(id) || id == key) {
      var oldId = getIdValue(target, schema);
      var newId = getIdValue(__assign(__assign({}, target), ((_b = {}), (_b[key] = value), _b)), schema);
      if (oldId != newId) {
        throw new Error('This update is not allowed because the resolved id is different from the original value');
      }
    }
    store.commit(path + '/' + Mutations.SET_PROP, { id: target._id, key: key, value: value, schema: schema });
  }
}
function createAccessor(target, key) {
  var schema = getConstructor(target);
  var path = schema._namespace,
    _store = schema._store,
    _fields = schema._fields;
  var isRelationship = _fields[key] instanceof Relationship;
  var relationshipDef = isRelationship ? _fields[key] : null;
  var load = target._load;
  Object.defineProperty(target, key, {
    enumerable: load && isRelationship ? load.has(key) : true,
    get: function () {
      if (target._connected) {
        if (load && isRelationship && !load.has(key)) return;
        var raw = _store.getters[path + '/' + Getters.GET_RAW](target._id, schema);
        var value = raw[key];
        if (isRelationship) {
          var opts = { load: load === null || load === void 0 ? void 0 : load.getLoad(key) };
          var Related = relationshipDef.schema;
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
          } else if (relationshipDef instanceof BelongsToRelationship) {
            if (!(raw === null || raw === void 0 ? void 0 : raw[relationshipDef.foreignKey])) return;
            value = raw[relationshipDef.foreignKey];
          }
          value = Related.find(value, opts);
          return opts.load ? opts.load.apply(value) : value;
        } else {
          return raw[key];
        }
      }
      return target._caches[getCacheName(isRelationship)][key];
    },
    set: function (value) {
      target._connected
        ? persistConnected(target, key, value, relationshipDef, schema)
        : persistUnconnected(target, key, value, relationshipDef);
    },
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
      _caches: {
        value: Object.fromEntries(
          cacheNames.map(function (name) {
            return [name, {}];
          })
        ),
      },
      _connected: {
        value: !!(opts === null || opts === void 0 ? void 0 : opts.connected),
        enumerable: false,
        configurable: true,
      },
      _load: { value: opts === null || opts === void 0 ? void 0 : opts.load, enumerable: false, configurable: true },
      _id: { value: id, enumerable: false, configurable: false, writable: true },
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
      var e_1, _b;
      var _c = __read(_a, 2),
        key = _c[0],
        val = _c[1];
      if (key in constructor._fields) {
        if (constructor._fields[key] instanceof Relationship) {
          var node = { item: _this, parentNode: parentNode };
          if (val == null) {
            acc[key] = val;
          } else if (Array.isArray(val)) {
            var items = [];
            try {
              for (var val_1 = __values(val), val_1_1 = val_1.next(); !val_1_1.done; val_1_1 = val_1.next()) {
                var item = val_1_1.value;
                items.push(
                  item.toJSON ? (hasSeen(item, node) ? '>>> Recursive item <<<' : item.toJSON(key, node)) : item
                );
              }
            } catch (e_1_1) {
              e_1 = { error: e_1_1 };
            } finally {
              try {
                if (val_1_1 && !val_1_1.done && (_b = val_1.return)) _b.call(val_1);
              } finally {
                if (e_1) throw e_1.error;
              }
            }
            acc[key] = items;
          } else {
            acc[key] = val.toJSON ? (hasSeen(val, node) ? '>>> Recursive item <<<' : val.toJSON(key, node)) : val;
          }
        } else {
          acc[key] = val;
        }
      }
      return acc;
    }, {});
  };
  /**
   * Converts the model to a plain javascript object.
   */
  Model.prototype.$toObject = function (allProps) {
    if (allProps === void 0) {
      allProps = false;
    }
    return modelToObject(this, getConstructor(this), allProps);
  };
  /**
   * Update the properties of the model with the given data. You don't need to pass the full model.
   * You can pass only the props you want to update, You can also pass related models or model-like data
   */
  Model.prototype.$update = function (data) {
    if (data === void 0) {
      data = {};
    }
    return __awaiter(this, void 0, void 0, function () {
      var constructor;
      var _this = this;
      return __generator(this, function (_a) {
        constructor = getConstructor(this);
        return [
          2 /*return*/,
          constructor._store
            .dispatch(constructor._namespace + '/update', {
              id: this._id,
              data: data,
              schema: constructor,
            })
            .then(function (id) {
              _this._connected = true;
              return id;
            }),
        ];
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
        return [
          2 /*return*/,
          new Promise(function (resolve) {
            var constructor = getConstructor(_this);
            if (_this._connected) {
              console.warn('No need calling $save');
            } else {
              var item = cacheNames.reduce(function (acc, name) {
                return __assign(__assign({}, acc), _this._caches[name]);
              }, {});
              resolve(
                constructor._store
                  .dispatch(constructor._namespace + '/' + Actions.ADD, { items: item, schema: constructor })
                  .then(function (res) {
                    _this._id = res;
                    _this._connected = true;
                    return res;
                  })
              );
            }
          }),
        ];
      });
    });
  };
  Model.prototype.$addRelated = function (related, data) {
    return __awaiter(this, void 0, void 0, function () {
      var constructor;
      return __generator(this, function (_a) {
        constructor = getConstructor(this);
        return [
          2 /*return*/,
          constructor._store.dispatch(constructor._namespace + '/' + Actions.ADD_RELATED, {
            id: this._id,
            related: related,
            data: data,
            schema: constructor,
          }),
        ];
      });
    });
  };
  Model.prototype.$removeRelated = function (related, relatedId) {
    return __awaiter(this, void 0, void 0, function () {
      var constructor;
      return __generator(this, function (_a) {
        constructor = getConstructor(this);
        return [
          2 /*return*/,
          constructor._store.dispatch(constructor._namespace + '/' + Actions.REMOVE_RELATED, {
            id: this._id,
            related: related,
            relatedId: relatedId,
            schema: constructor,
          }),
        ];
      });
    });
  };
  Object.defineProperty(Model, 'fields', {
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
    configurable: true,
  });
  /**
   * Find a model by the specified identifier
   */
  Model.find = function (id, opts) {
    if (opts === void 0) {
      opts = {};
    }
    return this._store.getters[this._namespace + '/' + Getters.FIND](id, this, opts);
  };
  /**
   * Find all items that match the specified ids
   *
   */
  Model.findByIds = function (ids, opts) {
    if (opts === void 0) {
      opts = {};
    }
    return this._store.getters[this._namespace + '/' + Getters.FIND_BY_IDS](ids, this, opts);
  };
  /**
   * Get all items of this type from the Database
   */
  Model.all = function (opts) {
    if (opts === void 0) {
      opts = {};
    }
    return this._store.getters[this._namespace + '/' + Getters.ALL](this, opts);
  };
  /**
   * Add the passed item to the database. It should match this model's schema.
   *
   * It returns a promise of the inserted entity's id
   */
  Model.add = function (item) {
    return this._store.dispatch(this._namespace + '/' + Actions.ADD, { items: item, schema: this });
  };
  /**
   * Add the passed items to the database. It should match this model's schema.
   *
   * It returns a promise of an array of ids for the inserted entities.
   */
  Model.addAll = function (items) {
    return this._store.dispatch(this._namespace + '/' + Actions.ADD, { items: items, schema: [this] });
  };
  Model.$item = function (factory) {
    var _this = this;
    return Item.define(factory, function () {
      return _this;
    });
  };
  Model.$list = function (factory) {
    var _this = this;
    return List.define(factory, function () {
      return _this;
    });
  };
  Model.$field = function (options) {
    if (options === void 0) {
      options = {};
    }
    return Field.define(options);
  };
  Model.$belongsTo = function (factory, foreignKey) {
    var _this = this;
    return BelongsTo.define(
      factory,
      function () {
        return _this;
      },
      foreignKey
    );
  };
  Model.$hasMany = function (factory, foreignKey) {
    var _this = this;
    return HasMany.define(
      factory,
      function () {
        return _this;
      },
      foreignKey
    );
  };
  Model.query = function (fn) {
    var query = new ModelQuery(this);
    fn && fn(query);
    return query;
  };
  /**
   * The identifier for the model. It also accepts an id resolver function that
   * receives a model-like param as input and returns the id;
   * @default 'id'
   */
  Model.id = 'id';
  return Model;
})();

function createModule(store, schemas, index) {
  var _a, _b, _c;
  return {
    namespaced: true,
    state: function () {
      return {
        indices: index.toObject(),
        data: __spread(
          new Set(
            schemas.map(function (schema) {
              return schema.entityName;
            })
          )
        ).reduce(function (state, name) {
          state[name] = {};
          return state;
        }, {}),
      };
    },
    mutations:
      ((_a = {}),
      (_a[Mutations.ADD_ALL] = function (state, _a) {
        var items = _a.items,
          schema = _a.schema;
        var storeName = schema.entityName;
        state.data[storeName] = __assign(
          __assign({}, state.data[storeName]),
          Object.fromEntries(
            Object.entries(items).map(function (_a) {
              var _b = __read(_a, 2),
                id = _b[0],
                entity = _b[1];
              return [id, __assign(__assign({}, state.data[storeName][id]), entity)];
            })
          )
        );
      }),
      (_a[Mutations.SET_PROP] = function (state, _a) {
        var id = _a.id,
          key = _a.key,
          value = _a.value,
          schema = _a.schema;
        if (state.data[schema.entityName][id] == null) {
          throw new Error('Entity does not exist');
        }
        Vue.set(state.data[schema.entityName][id], key, value);
      }),
      (_a[Mutations.SET_INDEX] = function (state, _a) {
        var indexName = _a.indexName,
          data = _a.data;
        Vue.set(state.indices, indexName, data);
      }),
      _a),
    actions:
      ((_b = {}),
      (_b[Actions.ADD] = function (ctx, _a) {
        var items = _a.items,
          schema = _a.schema;
        return normalizeAndStore(store, items, schema);
      }),
      (_b[Actions.ADD_RELATED] = function (_a, _b) {
        var _c;
        var dispatch = _a.dispatch,
          getters = _a.getters;
        var id = _b.id,
          related = _b.related,
          data = _b.data,
          schema = _b.schema;
        if (!(related in schema._fields && schema._fields[related] instanceof Relationship)) {
          throw new Error('Unknown Relationship: [' + related + ']');
        }
        var item = getters[Getters.FIND](id, schema);
        if (!item) {
          throw new Error("The item doesn't exist");
        }
        var relationshipDef = schema._fields[related];
        if (relationshipDef instanceof ListLike) {
          var items = (Array.isArray(data) ? data : [data]).filter(identity);
          data = item[related] || [];
          data = mergeUnique(data.concat(items), function (item) {
            return getIdValue(item, relationshipDef.schema);
          });
        }
        return dispatch(Actions.UPDATE, {
          id: id,
          data: ((_c = {}), (_c[related] = data), _c),
          schema: schema,
        });
      }),
      (_b[Actions.REMOVE_RELATED] = function (_a, _b) {
        var _c;
        var dispatch = _a.dispatch,
          getters = _a.getters;
        var id = _b.id,
          related = _b.related,
          relatedId = _b.relatedId,
          schema = _b.schema;
        if (!(related in schema._fields && schema._fields[related] instanceof Relationship)) {
          throw new Error('Unknown Relationship: [' + related + ']');
        }
        var ids = Array.isArray(id) ? id : [id];
        var items = getters[Getters.FIND_BY_IDS](ids, schema);
        if (items.length === 0) {
          console.warn('Invalid id Provided');
          return;
        }
        var relationshipDef = schema._fields[related];
        var relatedSchema = relationshipDef.schema;
        if (relationshipDef instanceof ListLike) {
          var relatedIds_1 = relatedId ? (Array.isArray(relatedId) ? relatedId : [relatedId]) : [];
          return Promise.all(
            items.map(function (item) {
              var _a;
              var relatedItems = relatedIds_1.length ? item[related] || [] : [];
              return dispatch(Actions.UPDATE, {
                id: id,
                data:
                  ((_a = {}),
                  (_a[related] = relatedItems.filter(function (item) {
                    return !relatedIds_1.includes(getIdValue(item, relatedSchema));
                  })),
                  _a),
                schema: schema,
              });
            })
          );
        } else {
          return dispatch(Actions.UPDATE, {
            id: id,
            data: ((_c = {}), (_c[related] = null), _c),
            schema: schema,
          });
        }
      }),
      (_b[Actions.UPDATE] = function (_a, _b) {
        var getters = _a.getters,
          dispatch = _a.dispatch;
        var id = _b.id,
          data = _b.data,
          schema = _b.schema;
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
          newItems = items.map(function (item) {
            return __assign(__assign({}, item), data);
          });
          var oldIds = items.map(function (item) {
            return getIdValue(item, schema);
          });
          var newIds_1 = newItems.map(function (item) {
            return getIdValue(item, schema);
          });
          var idHasChanged = oldIds.some(function (id, index) {
            return id != newIds_1[index];
          });
          if (idHasChanged) {
            throw new Error('Invalid Update: This would cause a change in the computed id.');
          }
        } else {
          var idName_1 = schema.id;
          newItems = items.map(function (item) {
            var _a;
            return __assign(
              __assign(__assign({}, isFunction(schema.id) ? item : null), data),
              ((_a = {}), (_a[idName_1] = id), _a)
            );
          });
        }
        return dispatch(Actions.ADD, { items: newItems, schema: [schema] });
      }),
      _b),
    getters:
      ((_c = {}),
      (_c[Getters.GET_RAW] = function (state) {
        return function (id, schema) {
          return state.data[schema.entityName][id];
        };
      }),
      (_c[Getters.GET_INDEX] = function (state) {
        return function (schema, path, id) {
          var _a;
          return ((_a = state.indices[schema.entityName][path]) === null || _a === void 0 ? void 0 : _a[id]) || [];
        };
      }),
      (_c[Getters.FIND] = function (_, getters) {
        return function (id, schema, opts) {
          if (opts === void 0) {
            opts = {};
          }
          var data = getters[Getters.GET_RAW](id, schema);
          if (!data) {
            return;
          }
          var load;
          if (opts.load) {
            load = !(opts.load instanceof Load)
              ? new Load(
                  new ItemRelationship(function () {
                    return schema;
                  })
                ).parse(opts.load)
              : opts.load;
          }
          return resolveModel(schema, data, { load: load, connected: true });
        };
      }),
      (_c[Getters.FIND_BY_IDS] = function (_, getters) {
        return function (ids, schema, opts) {
          if (ids === void 0) {
            ids = [];
          }
          if (opts === void 0) {
            opts = {};
          }
          return ids
            .map(function (id) {
              return getters[Getters.FIND](id, schema, opts);
            })
            .filter(identity);
        };
      }),
      (_c[Getters.ALL] = function (state, getters) {
        return function (schema, opts) {
          if (opts === void 0) {
            opts = {};
          }
          return getters[Getters.FIND_BY_IDS](Object.keys(state.data[schema.entityName]), schema, opts);
        };
      }),
      _c),
  };
}
var modelCache = new Map();
function resolveModel(schema, rawData, options) {
  var _a;
  if (options === void 0) {
    options = {};
  }
  var id = getIdValue(rawData, schema);
  if (!options.load) {
    if (!modelCache.has(schema)) {
      modelCache.set(schema, createObject());
    }
    var cache = modelCache.get(schema);
    return (_a = cache[id]) !== null && _a !== void 0 ? _a : (cache[id] = new schema(rawData, options));
  } else return new schema(rawData, options);
}
window.modelCache = modelCache;

function Field(options) {
  if (options === void 0) {
    options = {};
  }
  return function (target, propName) {
    var constructor = target.constructor;
    if (constructor._fields == null) {
      constructor._fields = createObject();
    }
    if (propName in constructor._fields) {
      return;
    }
    constructor._fields[propName] = Field.define(options);
  };
}
Field.define = function (options) {
  if (options === void 0) {
    options = {};
  }
  return new SimpleFieldDefinition(options);
};

function Item(factory) {
  return function (target, propName) {
    var constructor = target.constructor;
    if (constructor._fields == null) {
      constructor._fields = createObject();
    }
    if (propName in constructor._fields) {
      return;
    }
    constructor._fields[propName] = Item.define(factory, function () {
      return constructor;
    });
  };
}
Item.define = function (factory, parentFactory) {
  return new ItemRelationship(factory, parentFactory);
};

function List(factory) {
  return function (target, propName, other) {
    var constructor = target.constructor;
    if (constructor._fields == null) {
      constructor._fields = createObject();
    }
    if (propName in constructor._fields) {
      return;
    }
    constructor._fields[propName] = List.define(factory, function () {
      return constructor;
    });
  };
}
List.define = function (factory, parentFactory) {
  return new ListRelationship(factory);
};

var Watcher = /** @class */ (function () {
  function Watcher(schema, store, namespace, name) {
    this.schema = schema;
    this.store = store;
    this.namespace = namespace;
    this.name = name;
    this.interests = new Set();
  }
  Watcher.prototype.addRelationship = function (relationship) {
    if (relationship.schema != this.schema) {
      throw new Error('This relationship is not indexable on this watcher');
    }
    this.interests.add(relationship);
  };
  Watcher.prototype.registerWatcher = function () {
    var _this = this;
    this.unwatch && this.unwatch();
    var concerns = __spread(this.interests.values()).map(function (rel) {
      return [rel.parentSchema.entityName, rel.foreignKey];
    });
    this.unwatch = this.store.watch(
      function (state) {
        var e_1, _a, e_2, _b;
        var index = concerns.reduce(function (obj, _a) {
          var _b = __read(_a, 2),
            entityName = _b[0],
            foreignKey = _b[1];
          obj[entityName] = { foreignKey: foreignKey, data: createObject() };
          return obj;
        }, createObject());
        var entries = Object.entries(state[_this.namespace].data[_this.schema.entityName]);
        try {
          for (
            var entries_1 = __values(entries), entries_1_1 = entries_1.next();
            !entries_1_1.done;
            entries_1_1 = entries_1.next()
          ) {
            var _c = __read(entries_1_1.value, 2),
              relatedId = _c[0],
              value = _c[1];
            try {
              for (
                var concerns_1 = ((e_2 = void 0), __values(concerns)), concerns_1_1 = concerns_1.next();
                !concerns_1_1.done;
                concerns_1_1 = concerns_1.next()
              ) {
                var _d = __read(concerns_1_1.value, 2),
                  entityName = _d[0],
                  foreignKey = _d[1];
                if (value[foreignKey] == null) continue;
                if (!index[entityName].data[value[foreignKey]]) {
                  index[entityName].data[value[foreignKey]] = [];
                }
                index[entityName].data[value[foreignKey]].push(relatedId);
              }
            } catch (e_2_1) {
              e_2 = { error: e_2_1 };
            } finally {
              try {
                if (concerns_1_1 && !concerns_1_1.done && (_b = concerns_1.return)) _b.call(concerns_1);
              } finally {
                if (e_2) throw e_2.error;
              }
            }
          }
        } catch (e_1_1) {
          e_1 = { error: e_1_1 };
        } finally {
          try {
            if (entries_1_1 && !entries_1_1.done && (_a = entries_1.return)) _a.call(entries_1);
          } finally {
            if (e_1) throw e_1.error;
          }
        }
        return index;
      },
      function (rawIndex) {
        _this.store.commit(_this.namespace + '/' + Mutations.SET_INDEX, {
          indexName: _this.name,
          data: Object.fromEntries(
            Object.entries(rawIndex).map(function (_a) {
              var _b = __read(_a, 2),
                path = _b[0],
                data = _b[1];
              return [path, data.data];
            })
          ),
        });
      }
    );
  };
  return Watcher;
})();

var Index = /** @class */ (function () {
  function Index(store, namespace) {
    this.store = store;
    this.namespace = namespace;
    this.map = new Map();
  }
  Index.prototype.addIndex = function (relationship) {
    var watcher;
    var schema = relationship.schema;
    if (!this.map.has(schema)) {
      watcher = new Watcher(schema, this.store, this.namespace, schema.entityName);
      this.map.set(schema, watcher);
    } else {
      watcher = this.map.get(schema);
    }
    watcher.addRelationship(relationship);
  };
  Index.prototype.toObject = function () {
    var e_1, _a, e_2, _b;
    var result = createObject();
    try {
      for (var _c = __values(this.map), _d = _c.next(); !_d.done; _d = _c.next()) {
        var _e = __read(_d.value, 2),
          schema = _e[0],
          watcher = _e[1];
        result[schema.entityName] = createObject();
        try {
          for (var _f = ((e_2 = void 0), __values(watcher.interests)), _g = _f.next(); !_g.done; _g = _f.next()) {
            var relationship = _g.value;
            result[schema.entityName][relationship.parentSchema.entityName] = createObject();
          }
        } catch (e_2_1) {
          e_2 = { error: e_2_1 };
        } finally {
          try {
            if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
          } finally {
            if (e_2) throw e_2.error;
          }
        }
      }
    } catch (e_1_1) {
      e_1 = { error: e_1_1 };
    } finally {
      try {
        if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
      } finally {
        if (e_1) throw e_1.error;
      }
    }
    return result;
  };
  Index.prototype.init = function () {
    var e_3, _a;
    try {
      for (var _b = __values(this.map.values()), _c = _b.next(); !_c.done; _c = _b.next()) {
        var watcher = _c.value;
        watcher.registerWatcher();
      }
    } catch (e_3_1) {
      e_3 = { error: e_3_1 };
    } finally {
      try {
        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
      } finally {
        if (e_3) throw e_3.error;
      }
    }
  };
  Index.prototype.get = function (_a, parentId) {
    var schema = _a.schema,
      parentSchema = _a.parentSchema;
    return this.store.getters[this.namespace + '/' + Getters.GET_INDEX](schema, parentSchema.entityName, parentId);
  };
  return Index;
})();

var defaultPluginOptions = {
  schemas: [],
  namespace: 'database',
};
function generateDatabasePlugin(options) {
  var _a = __assign(__assign({}, defaultPluginOptions), options),
    schemas = _a.schemas,
    namespace = _a.namespace;
  return function (store) {
    var index = new Index(store, namespace);
    Object.defineProperty(Model, 'index', {
      value: index,
    });
    schemas.forEach(function (schema) {
      registerSchema(schema, store, namespace);
      Object.values(schema._fields).forEach(function (definition) {
        if (definition instanceof HasManyRelationship) index.addIndex(definition);
      });
    });
    store.registerModule(namespace, createModule(store, schemas, index));
    index.init();
  };
}

export { BelongsTo, Field, HasMany, Item, List, Model, generateDatabasePlugin };
//# sourceMappingURL=vuex-rdb.js.map
