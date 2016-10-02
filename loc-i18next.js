var locI18next = (function () {
'use strict';

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();















var _extends$1 = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

















var set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

var defaults$$1 = {
    selectorAttr: 'data-i18n',
    targetAttr: 'i18n-target',
    optionsAttr: 'i18n-options',
    useOptionsAttr: false,
    parseDefaultValueFromContent: true
};

function init(i18next) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    options = _extends$1({}, defaults$$1, options);

    function parse(elem, key, opts) {
        var attr = 'text';
        var extendDefault = function extendDefault(o, val) {
            return options.parseDefaultValueFromContent ? _extends$1({}, o, { defaultValue: val }) : o;
        };

        if (key.indexOf('[') == 0) {
            var parts = key.split(']');
            key = parts[1];
            attr = parts[0].substr(1, parts[0].length - 1);
        }

        if (key.indexOf(';') == key.length - 1) {
            key = key.substr(0, key.length - 2);
        }

        if (attr === 'html') {
            elem.innerHTML = i18next.t(key, extendDefault(opts, elem.innerHTML));
        } else if (attr === 'text') {
            elem.textContent = i18next.t(key, extendDefault(opts, elem.textContent));
        } else if (attr === 'prepend') {
            elem.innerHTML = [i18next.t(key, extendDefault(opts, elem.innerHTML)), elem.innerHTML].join('');
        } else if (attr === 'append') {
            elem.innerHTML = [elem.innerHTML, i18next.t(key, extendDefault(opts, elem.innerHTML))].join('');
        } else if (attr.indexOf('data-') === 0) {
            var dataAttr = attr.substr('data-'.length);
            var translated = i18next.t(key, extendDefault(opts, elem.getAttribute(dataAttr)));
            // we change into the data cache
            elem.setAttribute(dataAttr, translated);
            // we change into the dom
            elem.setAttribute(attr, translated);
        } else {
            elem.setAttribute(attr, i18next.t(key, extendDefault(opts, elem.getAttribute(attr))));
        }
    }

    function _loc(elem, opts) {
        var key = elem.getAttribute(options.selectorAttr);
        //        if (!key && typeof key !== 'undefined' && key !== false)
        //            key = elem.textContent || elem.innerHTML;
        if (!key) return;

        var target = elem,
            targetSelector = elem.getAttribute(options.targetAttr);

        if (targetSelector != null) target = elem.querySelector(targetSelector) || elem;

        if (!opts && options.useOptionsAttr === true) opts = elem.getAttribute(options.optionsAttr);

        opts = opts || {};

        if (key.indexOf(';') >= 0) {
            var keys = key.split(';');
            for (var ix = 0, l_ix = keys.length; ix < l_ix; ix++) {
                if (keys[ix] != '') parse(target, keys[ix], opts);
            }
        } else {
            parse(target, key, opts);
        }

        if (options.useOptionsAttr === true) {
            var clone = {};
            clone = _extends({ clone: clone }, opts);
            delete clone.lng;
            elem.setAttribute(options.optionsAttr, clone);
        }
    }

    function handle(selector, opts) {
        var elems = document.querySelectorAll(selector);
        for (var i = 0; i < elems.length; i++) {
            var elem = elems[i];
            var childs = elem.querySelectorAll('[' + options.selectorAttr + ']');
            for (var j = childs.length - 1; j > -1; j--) {
                _loc(childs[j], opts);
            }
            _loc(elem, opts);
        }
    }
    return handle;
}

var main = {
    init: init
};

return main;

}());
