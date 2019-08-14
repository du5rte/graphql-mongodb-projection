import { graphql } from 'graphql'
import schema from './schema'

import mongoose from 'mongoose'

import UserModel from './userModel'

import mockUsers from './users'

import {
  connectMongooseAndPopulate,
  clearDB,
  disconnectMongoose
} from './utils'

let connection
let db
beforeAll(async () => {
  connection = await connectMongooseAndPopulate()
})

afterAll(async () => {
  await clearDB()
  return disconnectMongoose()
})

beforeEach(async () => {
  await clearDB()
  connection = await connectMongooseAndPopulate()
  return connection
})

describe('Mongo Setup', () => {
  it('Should populate the Users collection for testing.', async done => {
    const users = await UserModel.find({})
    expect(users).toHaveLength(mockUsers.length)
    done()
  })
})

describe('Projection Tests', function() {
  it('All Fields', async function() {
    let query = `
      {
        user(_id: "583f1607bf98f7f846e7d2d1") {
          _id
          email
          firstname
          lastname
        }
      }
    `
    return graphql(schema, query).then(result => {
      expect(result).toMatchSnapshot()
    })
  })

  it('Only selected fields', async function() {
    let query = `
      {
        user(_id: "583f1607bf98f7f846e7d2d1") {
          email
        }
      }
    `
    return graphql(schema, query).then(result => {
      expect(result).toMatchSnapshot()
    })
  })

  it('All Fields with Union Type', async function() {
    let query = `
      {
        people {
          ... on UnnamedUser {
            _id
            email
          }

          ... on User {
            _id
            email
            firstname
          }
        }
      }
    `
    return graphql(schema, query).then(result => {
      expect(result).toMatchSnapshot()
    })
  })

  it('Nested Fields with Union Type', async function() {
    let query = `
    {
      user(_id: "583f1607bf98f7f846e7d2d2") {
        _id
        email
        firstname
        lastname
        friends {
          ... on UnnamedUser {
            _id
            email
          }

          ... on User {
            _id
            firstname
          }
        }
      }
    }
    `

    return graphql(schema, query).then(result => {
      expect(result).toMatchSnapshot()
    })
  })

  it('Conditional fields', async function() {
    let query = `
    {
      user(_id: "583f1607bf98f7f846e7d2d2") {
        avatar
      }
    }
    `

    return graphql(schema, query).then(result => {
      expect(result).toMatchSnapshot()
    })
  })

  it('Nested fields', async function() {
    let query = `
    {
      user(_id: "583f1607bf98f7f846e7d2d5") {
        _id
        nested {
          level
          deep {
            deepLevel
            otherField
          }
        }
      }
    }`

    return graphql(schema, query).then(result => {
      expect(result).toMatchSnapshot()
    })
  })
})

export { connection, db }
