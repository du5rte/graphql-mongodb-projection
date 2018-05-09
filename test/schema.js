import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLEnumType,
  GraphQLNonNull,
  GraphQLUnionType,
} from 'graphql'

import db from './MongoDBMockup'

import graphqlMongodbProjection from '../src'

const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'User Object',
  fields: () => ({
    _id: {type: new GraphQLNonNull(GraphQLID)},
    email: {type: new GraphQLNonNull(GraphQLString)},
    firstname: {type: new GraphQLNonNull(GraphQLString)},
    lastname: {type: new GraphQLNonNull(GraphQLString)},
    friends: {type: new GraphQLList(PersonType)},
    avatar: {type: GraphQLString}
  })
})

const UnnamedUserType = new GraphQLObjectType({
  name: 'UnnamedUser',
  fields: {
    _id: {type: new GraphQLNonNull(GraphQLID)},
    email: {type: new GraphQLNonNull(GraphQLString)}
  }
})

const PersonType = new GraphQLUnionType({
  name: 'Person',
  types: [ UserType, UnnamedUserType ],
  resolveType(value) {
    if (value.firstname) {
      return UserType;
    }

    return UnnamedUserType;
  }
})

const user = {
  type: UserType,
  description: 'Get user by ID',
  args: {
    _id: {type: new GraphQLNonNull(GraphQLString)},
  },
  resolve(root, { _id }, ctx, info) {
    const projection = graphqlMongodbProjection(info, {
      'avatar': 'profile.avatar'
    })

    console.log(projection)

    return db.findOne({ _id }, projection)
  }
}

const people = {
  type: new GraphQLList(PersonType),
  description: 'Get people',
  args: {},
  resolve(root, args, ctx, info) {
    const projection = graphqlMongodbProjection(info)

    console.log(projection)

    return db.find({}, projection)
  }
}

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Queries',
    fields: () => ({
      user,
      people
    })
  })
})

export default schema
