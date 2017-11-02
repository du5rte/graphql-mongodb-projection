import assert from 'assert'

import { graphql } from 'graphql';
import schema from './schema'

import infoToProjection from '../src'

describe('Projection Tests', function() {
  it('All Fields', function() {
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
        let user = result.data.user
        assert.ok(user._id)
        assert.ok(user.email)
        assert.ok(user.firstname)
        assert.ok(user.lastname)
      })
  })

  it('Only selected fields', function() {
    let query = `
      {
        user(_id: "583f1607bf98f7f846e7d2d1") {
          email
        }
      }
    `
    return graphql(schema, query).then(result => {
        let user = result.data.user
        assert.ok(!user._id)
        assert.ok(!user.firstname)
        assert.ok(!user.lastname)
      })
  })

  it('All Fields with Union Type', function() {
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
        let people = result.data.people
        assert.notEqual(people, null)
        assert.equal(people.length, 4)
      })
  })

  it('Nested Fields with Union Type', function() {
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
        let user = result.data.user
        assert.equal(typeof result.errors, 'undefined')
      })
  })
})
