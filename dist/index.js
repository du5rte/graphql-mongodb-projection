'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = infoToProjection;
function infoToProjection(info) {
  let context = arguments.length <= 1 || arguments[1] === undefined ? info.fieldASTs[0] : arguments[1];

  return context.selectionSet.selections.reduce((projection, selection) => {
    switch (selection.kind) {
      case 'Field':

        let nodeSelection = undefined;

        if (selection && selection.selectionSet && selection.selectionSet.selections) {
          nodeSelection = selection.selectionSet.selections.find(sel => sel.name.value === 'node');
        }

        if (selection.name.value === 'edges' && typeof nodeSelection !== 'undefined') {
          return _extends({}, projection, infoToProjection(info, nodeSelection));
        } else {
          return _extends({}, projection, {
            [selection.name.value]: true
          });
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