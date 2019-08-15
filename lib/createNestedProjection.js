"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createNestedProjections;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function createNestedProjections(parent, grandParentValue) {
  const childSelections = parent.selectionSet.selections;
  const parentValue = parent.name ? grandParentValue ? `${grandParentValue}.${parent.name.value}` : parent.name.value : grandParentValue ? grandParentValue : '';
  const x = childSelections.reduce((acc, child, i) => {
    if (!child.selectionSet) {
      const childValue = child.name.value;
      const relation = parentValue && `${parentValue}.${childValue}`;
      acc[relation] = 1;
      return acc;
    }

    if (child.kind === 'InlineFragment') {
      return _objectSpread({}, acc, {}, createNestedProjections(child, parent.name.value));
    }

    return _objectSpread({}, acc, {}, createNestedProjections(child, parentValue));
  }, {});
  return x;
}