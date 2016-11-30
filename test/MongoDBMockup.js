import users from './users.json'

export default class MongoDBMockup {
  static findOne(query, projection) {
    let result = users.find((user) => {
      if (query._id === user._id) {
        return user
      } else {
        return {}
      }
    })

    if (projection) {
      return this.projection(result, projection)
    } else {
      return result
    }

  }

  static projection(result, projection) {
    return Object.entries(result).reduce((filtered, entry, index, array) => {
      let [key, value] = entry

      if (projection[key]) {
        return {...filtered, [key]: value}
      } else {
        return filtered
      }
    }, {})
  }
}
