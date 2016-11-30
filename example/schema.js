import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLEnumType,
  GraphQLNonNull,
} from 'graphql'

import { db, ObjectId } from 'mongodb'

import infoToProjection from '../src'

const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'User Object',
  fields: () => ({
    _id: {type: new GraphQLNonNull(GraphQLID)},
    email: {type: new GraphQLNonNull(GraphQLString)},
    firstname: {type: new GraphQLNonNull(GraphQLString)},
    lastname: {type: new GraphQLNonNull(GraphQLString)}
  })
})

const user = {
  type: UserType,
  description: 'Get user by ID',
  args: {
    _id: {type: new GraphQLNonNull(GraphQLString)},
  },
  resolve(root, { _id }, ctx, info) {
    // HERE ->
    return db.collection('users').findOne({_id: ObjectId(_id)}, infoToProjection(info))
  }
}

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Queries',
    fields: () => ({
      user
    })
  })
})

export default schema
