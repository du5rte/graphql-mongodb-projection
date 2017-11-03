export default function infoToProjection(info, context = (info.fieldASTs || info.fieldNodes)[0]) {
  return context.selectionSet.selections.reduce((projection, selection) => {
    switch (selection.kind) {
      case 'Field':

        let nodeSelection = undefined;

        if (
          selection &&
          selection.selectionSet &&
          selection.selectionSet.selections
        ) {
          nodeSelection = selection.selectionSet.selections.find(
            sel => sel.name && sel.name.value && sel.name.value === 'node'
          )
        }

        if (
          selection.name.value === 'edges' &&
          typeof nodeSelection !== 'undefined'
        ) {
          return {
            ...projection,
            ...infoToProjection(info, nodeSelection)
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
