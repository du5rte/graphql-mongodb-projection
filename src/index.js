const isBoolean = val => typeof val === 'boolean'
const isString = val => typeof val === 'string'

export function infoToProjection(info, context = (info.fieldASTs || info.fieldNodes)[0]) {
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

export function conditionsToProjection(_projection, conditions) {
  return Object.entries(conditions).reduce((projection, [key, value]) => {
    // if value is Boolean add to projection
    if (isBoolean(value)) {
      return {
        ...projection,
        [key]: value
      }
    }

    // if value is String and exists in _projection replace it with value
    // https://medium.com/front-end-hacking/immutably-rename-object-keys-in-javascript-5f6353c7b6dd
    else if (isString(value) && projection.hasOwnProperty(key)) {
      const { [key]: _Key, ...rest } = projection

      return {
        ...rest,
        [value]: true
      }
    }

    else {
      return projection
    }
  }, _projection)
}

export function graphqlMongodbProjection(info, conditions) {
  const infoProjection = infoToProjection(info)

  if (conditions) {
    const conditionaProjection = conditionsToProjection(infoProjection, conditions)

    return conditionaProjection
  }

  return infoProjection
}

export default graphqlMongodbProjection
