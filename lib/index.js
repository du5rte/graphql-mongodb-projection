"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.infoToProjection = infoToProjection;
exports.conditionsToProjection = conditionsToProjection;
exports.graphqlMongodbProjection = graphqlMongodbProjection;
exports.default = void 0;

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _createNestedProjection = _interopRequireDefault(require("./createNestedProjection"));

function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }

function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

const isBoolean = val => typeof val === 'boolean';

const isString = val => typeof val === 'string';

function infoToProjection(info, context = (info.fieldASTs || info.fieldNodes)[0]) {
  return context.selectionSet.selections.reduce((projection, selection) => {
    switch (selection.kind) {
      case 'Field':
        let nodeSelection = undefined;

        if (selection && selection.selectionSet && selection.selectionSet.selections) {
          nodeSelection = selection.selectionSet.selections.find(sel => sel.name && sel.name.value && sel.name.value === 'node');
        }

        if (selection.name.value === 'edges' && typeof nodeSelection !== 'undefined') {
          return _objectSpread({}, projection, {}, infoToProjection(info, nodeSelection));
        } else {
          // Handle nested fields by checking if the current selection has a selectionSet
          // and if so pass it to the recursive createNestedProjections.
          if (selection.selectionSet && selection.selectionSet.selections.length > 0) {
            const nestedProjections = (0, _createNestedProjection.default)(selection);
            return _objectSpread({}, projection, {}, nestedProjections);
          }

          return _objectSpread({}, projection, {
            [selection.name.value]: true
          });
        }

      // TODO: to test, not sure what they are

      case 'InlineFragment':
        return _objectSpread({}, projection, {}, infoToProjection(info, selection));

      case 'FragmentSpread':
        return _objectSpread({}, projection, {}, infoToProjection(info, info.fragments[selection.name.value]));

      default:
        // TODO: is it worth throwing an error? or just pass unknow kinds
        //  throw new Error('Unsuported query selection')
        return {};
    }
  }, {});
}

function conditionsToProjection(_projection, conditions) {
  return Object.entries(conditions).reduce((projection, [key, value]) => {
    // if value is Boolean add to projection
    if (isBoolean(value)) {
      return _objectSpread({}, projection, {
        [key]: value
      });
    } // if value is String and exists in _projection replace it with value
    // https://medium.com/front-end-hacking/immutably-rename-object-keys-in-javascript-5f6353c7b6dd
    else if (isString(value) && projection.hasOwnProperty(key)) {
        const {
          [key]: _Key
        } = projection,
              rest = (0, _objectWithoutProperties2.default)(projection, [key].map(_toPropertyKey));
        return _objectSpread({}, rest, {
          [value]: true
        });
      } else {
        return projection;
      }
  }, _projection);
}

function graphqlMongodbProjection(info, conditions) {
  const infoProjection = infoToProjection(info);

  if (conditions) {
    const conditionaProjection = conditionsToProjection(infoProjection, conditions);
    return conditionaProjection;
  }

  return infoProjection;
}

var _default = graphqlMongodbProjection;
exports.default = _default;