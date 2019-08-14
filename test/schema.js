import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLEnumType,
  GraphQLNonNull,
  GraphQLUnionType
} from 'graphql'

import graphqlMongodbProjection from '../src/index'

import UserModel from './userModel'

const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'User Object',
  fields: () => ({
    _id: { type: new GraphQLNonNull(GraphQLID) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    firstname: { type: new GraphQLNonNull(GraphQLString) },
    lastname: { type: new GraphQLNonNull(GraphQLString) },
    friends: {
      type: new GraphQLList(PersonType),
      resolve(root, _, __, x) {
        const projection = graphqlMongodbProjection(x)
        // should use dataloader in a real setup.
        return UserModel.find({ _id: { $in: root.friends } }, projection)
      }
    },
    avatar: { type: GraphQLString },
    nested: { type: NestedType }
  })
})

const DeepType = new GraphQLObjectType({
  name: 'Deep',
  description: 'Nested Nested Object',
  fields: () => ({
    deepLevel: { type: GraphQLString },
    otherField: { type: GraphQLString }
  })
})

const NestedType = new GraphQLObjectType({
  name: 'Nested',
  description: 'Nested Object',
  fields: () => ({
    deep: { type: DeepType },
    level: { type: GraphQLString },
    otherField: { type: GraphQLString }
  })
})

const UnnamedUserType = new GraphQLObjectType({
  name: 'UnnamedUser',
  fields: {
    _id: { type: new GraphQLNonNull(GraphQLID) },
    email: { type: new GraphQLNonNull(GraphQLString) }
  }
})

const PersonType = new GraphQLUnionType({
  name: 'Person',
  types: [UserType, UnnamedUserType],
  resolveType(value) {
    if (value.firstname) {
      return UserType
    }

    return UnnamedUserType
  }
})

const user = {
  type: UserType,
  description: 'Get user by ID',
  args: {
    _id: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve: async (root, { _id }, ctx, info) => {
    const projection = graphqlMongodbProjection(info, {
      avatar: 'profile.avatar',
      'friends._id': 'friends'
    })
    console.log(projection)

    return UserModel.findById(_id, projection)
  }
}

const people = {
  type: new GraphQLList(PersonType),
  description: 'Get people',
  args: {},
  resolve(root, args, ctx, info) {
    const projection = graphqlMongodbProjection(info)

    console.log(projection)

    return UserModel.find({}, projection)
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
