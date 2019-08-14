export default function createNestedProjections(parent, grandParentValue) {
  const childSelections = parent.selectionSet.selections
  const parentValue = parent.name
    ? grandParentValue
      ? `${grandParentValue}.${parent.name.value}`
      : parent.name.value
    : grandParentValue
    ? grandParentValue
    : ''

  const x = childSelections.reduce((acc, child, i) => {
    if (!child.selectionSet) {
      const childValue = child.name.value
      const relation = parentValue && `${parentValue}.${childValue}`
      acc[relation] = 1
      return acc
    }
    if (child.kind === 'InlineFragment') {
      return {
        ...acc,
        ...createNestedProjections(child, parent.name.value)
      }
    }
    return {
      ...acc,
      ...createNestedProjections(child, parentValue)
    }
  }, {})
  return x
}
