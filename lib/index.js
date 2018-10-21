'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var kitsuCore = require('kitsu-core');
var Fly = _interopDefault(require('flyio/dist/npm/wx'));
var pluralise = _interopDefault(require('pluralize'));

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

// 当前环境是否为开发环境
var devTools = process.env.NODE_ENV === 'development'; // http://127.0.0.1:3000

var config = {
  // 主机域名
  baseURL: devTools ? 'https://ktt.openxyz.com' : '',
  // 小程序 Key
  appKey: '',
  // 小程序 Id
  appId: ''
};

// 导入配置
var fly = new Fly(); // 超时配置

fly.config.timeout = 5 * 1000; // 公共 Headers

fly.config.headers['X-Tag'] = 'flyio';
fly.config.headers['Content-Type'] = 'application/vnd.api+json'; // 服务器地址

fly.config.baseURL = config.baseURL; // 添加请求拦截器

fly.interceptors.request.use(function (request) {
  // 自定义请求头
  request.headers['X-Tag'] = 'flyio'; // 如果是 GET 将 request.body 转换，模拟 axios 的paramsSerializer

  if (request.method === 'GET') {
    request.body = kitsuCore.query(request.body);
  }

  var accessToken = wx.getStorageSync('access_token'); // 如果包含了 token，直接返回

  if (accessToken === undefined || request.headers['Authorization']) {
    return request;
  } // 如果没有 token，在 headers 里添加


  request.headers['Authorization'] = "Bearer ".concat(accessToken); // 打印请求体

  console.log('fly请求体 -->>>%o', request.body);
  return request;
}); // 添加响应拦截器

fly.interceptors.response.use(function (response) {
  // 打印返回体
  console.log('fly返回体 -->>>%o', response.data); // @TODO 这里返回 data ??

  return response;
},
/**
 * @see https://jsonapi.org/format/#errors
 */
function (E) {
  if (E.response) {
    var e = E.response.data;
    if (e && e.errors) E.errors = e.errors;
  }

  return E; // 发生网络错误
});

var _class, _class2, _temp;

function getModelName(target, name, descriptor) {
  target.model = target.getModelName();
}

var API = getModelName(_class = (_temp = _class2 =
/*#__PURE__*/
function () {
  function API() {
    _classCallCheck(this, API);
  }

  _createClass(API, null, [{
    key: "getModelName",
    value: function getModelName() {
      return this.prototype.constructor.name;
    }
  }, {
    key: "get",

    /**
     * @example Basic Usage
     * API.get({
     *    id: 1,
     *    relationship: 'json',
     *    msg: 'test',
     *    ...
     *  },
     *  {'Content-Type': 'application/json'}
     * )
     * @param {Object} body
     * @param {number} body.id
     * @param {string} body.relationship
     * @param {*} params
     * @param {*} headers
     */
    value: function () {
      var _get$$1 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        var body,
            headers,
            id,
            relationship,
            params,
            url,
            _ref,
            data,
            _args = arguments;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                body = _args.length > 0 && _args[0] !== undefined ? _args[0] : {};
                headers = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
                _context.prev = 2;
                id = body.id, relationship = body.relationship, params = _objectWithoutProperties(body, ["id", "relationship"]);
                url = this.plural(this.resCase(this.getModelName()));
                if (id) url += "/".concat(id);
                if (relationship) url += "/".concat(this.resCase(relationship));
                _context.next = 9;
                return this.axios.get(url, {
                  params: params,
                  // @FIXME flyio 不支持 paramsSerializer
                  // paramsSerializer: p => query(p),
                  headers: Object.assign(this.headers, headers)
                });

              case 9:
                _ref = _context.sent;
                data = _ref.data;
                return _context.abrupt("return", kitsuCore.deserialise(data));

              case 14:
                _context.prev = 14;
                _context.t0 = _context["catch"](2);
                this.onError(_context.t0);

              case 17:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[2, 14]]);
      }));

      return function get() {
        return _get$$1.apply(this, arguments);
      };
    }()
  }, {
    key: "patch",
    value: function () {
      var _patch = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(body) {
        var headers,
            model,
            serialData,
            url,
            _ref2,
            data,
            _args2 = arguments;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                headers = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : {};
                _context2.prev = 1;
                model = this.getModelName();
                _context2.next = 5;
                return kitsuCore.serialise.apply(this, [model, body, 'PUT']);

              case 5:
                serialData = _context2.sent;
                url = this.plural(this.resCase(model)) + '/' + body.id;
                _context2.next = 9;
                return this.axios.put(url, serialData, {
                  headers: Object.assign(this.headers, headers)
                });

              case 9:
                _ref2 = _context2.sent;
                data = _ref2.data;
                return _context2.abrupt("return", data);

              case 14:
                _context2.prev = 14;
                _context2.t0 = _context2["catch"](1);
                this.onError(_context2.t0);

              case 17:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[1, 14]]);
      }));

      return function patch(_x) {
        return _patch.apply(this, arguments);
      };
    }()
  }, {
    key: "delete",
    value: function () {
      var _delete2 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3(id) {
        var headers,
            model,
            url,
            _ref3,
            data,
            _args3 = arguments;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                headers = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : {};
                _context3.prev = 1;
                model = this.getModelName();
                url = this.plural(this.resCase(model)) + '/' + id;
                _context3.t0 = this.axios;
                _context3.t1 = url;
                _context3.next = 8;
                return kitsuCore.serialise.apply(this, [model, {
                  id: id
                }, 'DELETE']);

              case 8:
                _context3.t2 = _context3.sent;
                _context3.t3 = Object.assign(this.headers, headers);
                _context3.t4 = {
                  data: _context3.t2,
                  headers: _context3.t3
                };
                _context3.next = 13;
                return _context3.t0.delete.call(_context3.t0, _context3.t1, _context3.t4);

              case 13:
                _ref3 = _context3.sent;
                data = _ref3.data;
                return _context3.abrupt("return", data);

              case 18:
                _context3.prev = 18;
                _context3.t5 = _context3["catch"](1);
                this.onError(_context3.t5);

              case 21:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[1, 18]]);
      }));

      return function _delete(_x2) {
        return _delete2.apply(this, arguments);
      };
    }()
  }, {
    key: "self",
    value: function () {
      var _self = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee4() {
        var params,
            headers,
            res,
            _args4 = arguments;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                params = _args4.length > 0 && _args4[0] !== undefined ? _args4[0] : {};
                headers = _args4.length > 1 && _args4[1] !== undefined ? _args4[1] : {};
                _context4.prev = 2;
                _context4.next = 5;
                return this.get('users', // users ??
                Object.assign({
                  filter: {
                    self: true
                  }
                }, params), headers);

              case 5:
                res = _context4.sent;
                return _context4.abrupt("return", res.data[0]);

              case 9:
                _context4.prev = 9;
                _context4.t0 = _context4["catch"](2);
                this.onError(_context4.t0);

              case 12:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this, [[2, 9]]);
      }));

      return function self() {
        return _self.apply(this, arguments);
      };
    }()
  }, {
    key: "post",
    value: function () {
      var _post = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee5(body) {
        var headers,
            model,
            url,
            _ref4,
            data,
            _args5 = arguments;

        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                headers = _args5.length > 1 && _args5[1] !== undefined ? _args5[1] : {};
                _context5.prev = 1;
                model = this.getModelName();
                url = this.plural(this.resCase(model));
                _context5.t0 = this.axios;
                _context5.t1 = url;
                _context5.next = 8;
                return kitsuCore.serialise.apply(this, [model, body]);

              case 8:
                _context5.t2 = _context5.sent;
                _context5.t3 = {
                  headers: Object.assign(this.headers, headers)
                };
                _context5.next = 12;
                return _context5.t0.post.call(_context5.t0, _context5.t1, _context5.t2, _context5.t3);

              case 12:
                _ref4 = _context5.sent;
                data = _ref4.data;
                return _context5.abrupt("return", data);

              case 17:
                _context5.prev = 17;
                _context5.t4 = _context5["catch"](1);
                this.onError(_context5.t4);

              case 20:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this, [[1, 17]]);
      }));

      return function post(_x3) {
        return _post.apply(this, arguments);
      };
    }()
    /**
     *
     * @param {Object} header
     */

  }, {
    key: "setHeader",
    value: function setHeader() {
      var header = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      this.headers = Object.assign(this.headers, header);
    }
  }, {
    key: "all",
    value: function () {
      var _all = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee6() {
        var params,
            headers,
            _args6 = arguments;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                params = _args6.length > 0 && _args6[0] !== undefined ? _args6[0] : {};
                headers = _args6.length > 1 && _args6[1] !== undefined ? _args6[1] : {};
                return _context6.abrupt("return", this.get(params, headers));

              case 3:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      return function all() {
        return _all.apply(this, arguments);
      };
    }()
  }, {
    key: "getById",
    value: function () {
      var _getById = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee7(id) {
        var params,
            headers,
            _args7 = arguments;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                params = _args7.length > 1 && _args7[1] !== undefined ? _args7[1] : {};
                headers = _args7.length > 2 && _args7[2] !== undefined ? _args7[2] : {};
                return _context7.abrupt("return", this.get(_objectSpread({
                  id: id
                }, params), headers));

              case 3:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      return function getById(_x4) {
        return _getById.apply(this, arguments);
      };
    }()
  }, {
    key: "update",
    value: function () {
      var _update = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee8() {
        var params,
            headers,
            _args8 = arguments;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                params = _args8.length > 0 && _args8[0] !== undefined ? _args8[0] : {};
                headers = _args8.length > 1 && _args8[1] !== undefined ? _args8[1] : {};
                return _context8.abrupt("return", this.patch(params, headers));

              case 3:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      return function update() {
        return _update.apply(this, arguments);
      };
    }()
  }, {
    key: "create",
    value: function () {
      var _create = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee9() {
        var params,
            headers,
            _args9 = arguments;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                params = _args9.length > 0 && _args9[0] !== undefined ? _args9[0] : {};
                headers = _args9.length > 1 && _args9[1] !== undefined ? _args9[1] : {};
                return _context9.abrupt("return", this.post(params, headers));

              case 3:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      return function create() {
        return _create.apply(this, arguments);
      };
    }()
  }, {
    key: "onError",
    value: function onError(e) {
      console.log(Date.now(), 'on error:', e);
    }
  }]);

  return API;
}(), _class2.axios = fly, _class2.plural = pluralise, _class2.headers = {}, _class2.camel = kitsuCore.snake, _class2.resCase = kitsuCore.snake, _temp)) || _class;

module.exports = API;
