import users from './users.json'

export default class MongoDBMockup {
  static findOne(query, projection) {
    let result = users.filter(user => user._id === query._id );
    result = result.length ? result.shift() : {};

    if ( result.friends ) {
      result.friends = result.friends.map(friend => (users.filter(user => user._id === friend ).shift()))
    }

    if (projection) {
      return this.projection(result, projection)
    } else {
      return result
    }
  }

  static find(query, projection) {
    let result = users;

    if (projection) {
      return result.map(entry => this.projection(entry, projection))
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
