export default function infoToProjection(info, context = info.fieldASTs[0]) {
  return context.selectionSet.selections.reduce((projection, selection) => {
    switch (selection.kind) {
      case 'Field':

        if(selection.name.value === 'edges') {
          return {
            ...projection,
            ...infoToProjection(info, selection.selectionSet.selections[0])
          }
        } else {
          return {
            ...projection,
            [selection.name.value]: true
          }
        }

      // TODO: to test, not sure what they are
      case 'InlineFragment':
        return {
          ...projection,
          ...infoToProjection(info, selection)
        }

      case 'FragmentSpread':
        return {
          ...projection,
          ...infoToProjection(info, info.fragments[selection.name.value])
        }

      default:
        // TODO: is it worth throwing an error? or just pass unknow kinds
        //  throw new Error('Unsuported query selection')
        return {}
    }
  }, {})
}
