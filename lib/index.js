'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _entries = require('babel-runtime/core-js/object/entries');

var _entries2 = _interopRequireDefault(_entries);

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.infoToProjection = infoToProjection;
exports.conditionsToProjection = conditionsToProjection;
exports.graphqlMongodbProjection = graphqlMongodbProjection;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var isBoolean = function isBoolean(val) {
  return typeof val === 'boolean';
};
var isString = function isString(val) {
  return typeof val === 'string';
};

function infoToProjection(info) {
  var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : (info.fieldASTs || info.fieldNodes)[0];

  return context.selectionSet.selections.reduce(function (projection, selection) {
    switch (selection.kind) {
      case 'Field':

        var nodeSelection = undefined;

        if (selection && selection.selectionSet && selection.selectionSet.selections) {
          nodeSelection = selection.selectionSet.selections.find(function (sel) {
            return sel.name && sel.name.value && sel.name.value === 'node';
          });
        }

        if (selection.name.value === 'edges' && typeof nodeSelection !== 'undefined') {
          return _extends({}, projection, infoToProjection(info, nodeSelection));
        } else {
          return _extends({}, projection, _defineProperty({}, selection.name.value, true));
        }

      // TODO: to test, not sure what they are
      case 'InlineFragment':
        return _extends({}, projection, infoToProjection(info, selection));

      case 'FragmentSpread':
        return _extends({}, projection, infoToProjection(info, info.fragments[selection.name.value]));

      default:
        // TODO: is it worth throwing an error? or just pass unknow kinds
        //  throw new Error('Unsuported query selection')
        return {};
    }
  }, {});
}

function conditionsToProjection(_projection, conditions) {
  return (0, _entries2.default)(conditions).reduce(function (projection, _ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        key = _ref2[0],
        value = _ref2[1];

    // if value is Boolean add to projection
    if (isBoolean(value)) {
      return _extends({}, projection, _defineProperty({}, key, value));
    }

    // if value is String and exists in _projection replace it with value
    // https://medium.com/front-end-hacking/immutably-rename-object-keys-in-javascript-5f6353c7b6dd
    else if (isString(value) && projection.hasOwnProperty(key)) {
        var _Key = projection[key],
            rest = _objectWithoutProperties(projection, [key]);

        return _extends({}, rest, _defineProperty({}, value, true));
      } else {
        return projection;
      }
  }, _projection);
}

function graphqlMongodbProjection(info, conditions) {
  var infoProjection = infoToProjection(info);

  if (conditions) {
    var conditionaProjection = conditionsToProjection(infoProjection, conditions);

    return conditionaProjection;
  }

  return infoProjection;
}

exports.default = graphqlMongodbProjection;