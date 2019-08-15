# graphql-mongodb-projection

[![Build Status](https://travis-ci.org/du5rte/graphql-mongodb-projection.svg?branch=master)](https://travis-ci.org/du5rte/graphql-mongodb-projection)
[![David](https://img.shields.io/david/peer/du5rte/graphql-mongodb-projection.svg)](https://github.com/du5rte/graphql-mongodb-projection)
[![npm version](https://img.shields.io/npm/v/graphql-mongodb-projection.svg)](https://www.npmjs.com/package/graphql-mongodb-projection)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-blue.svg)](CONTRIBUTING.md#pull-requests)

Uses GraphQL resolve's info to generate mongoDB projections

Supports:
- Fields
- Nested Fields
- InlineFragments
- FragmentSpreads
- Relay Edge Node Pattern

references:
- [Getting selectionSet from fieldASTs](https://github.com/graphql/graphql-js/issues/96)
- [Risingstack Getting Started with GraphlQL and MongoDB ](https://blog.risingstack.com/graphql-overview-getting-started-with-graphql-and-nodejs/)

## Usage

```sh
$ npm install --save-dev graphql-mongodb-projection
```

Just add it has a second parameter in a `.findOne` inside the `resolve` function, make sure to pass it `info`. (example using `koa` with `express` is the 3rd parameter).

```js
import graphqlMongodbProjection from 'graphql-mongodb-projection'

const user = {
  type: UserType,
  description: 'Get User by ID',
  args: {
    _id: {type: new GraphQLNonNull(GraphQLString)},
  },
  resolve(root, args, ctx, info) {
    return db.collection('users').findOne({_id: ObjectId(args._id)}, graphqlMongodbProjection(info))
  }
}
```

## Conditional fields

```js
resolve(root, args, ctx, info) {
  const projection = graphqlMongodbProjection(info, {
    // if asked for `avatar` will project `profile.avatar`
    'avatar': 'profile.avatar',
    // always return `verified`
    'verified': true
  })
}

```

## Referenced Documents

When querying on a field that stores an array of some value (usually `_id`) in the database, but will **resolve** to another document with the GraphQL resolver like the example below.

```
// friends is the field referred to above.
const user = {
    _id: '583f1607bf98f7f846e7d2d2',
    email: 'bradpitt@mail.com',
    firstname: 'Brad',
    lastname: 'Pitt',
    friends: [
      '583f1607bf98f7f846e7d2d1',
      '583f1607bf98f7f846e7d2d3',
      '583f1607bf98f7f846e7d2d4'
    ],
  }
```

Then you will need to include in the Conditional Fields object the nested values of the document **to be** resolved as the key and parent queried field as the value as shown below.

```js
// a friend document has the same fields as user, therefore,
// user resolve function for GraphQL
async function resolve(root, { _id }, ctx, info) {
  const projection = graphqlMongodbProjection(info, {
    avatar: 'profile.avatar',
    'friends._id': 'friends'
    'friends.firstname': 'friends'
    'friends.lastname': 'friends'
    ...
  })

  console.log(projection)

  return UserModel.findById(_id, projection)
}

```

The reason for this is that `friend.firstname`, etc. do not match any fields with the MongoDB projection object during the query.


## On `GraphiQL`
```
fragment userInfo on User {
  email
  firstname
}

query {

  # standard fields
  test1: user(_id: "574f263d19bb93d88f1d586d") {
  	_id
  	email
  	firstname
  	lastname
  }

  # with fragment
  test2: user(_id: "573124fb17c1b1631b00ccd1") {
    ...userInfo
  }

  # with fragment
  test3: user(_id: "573124fb17c1b1631b00ccd1") {
    ...userInfo
  }

  # edge node pattern
  test4: users {
    edges {
      node {
  			email
  			firstname
      }
    }
  }

  # edge node pattern with fragment
  test5: users {
    edges {
      node {
				...userInfo
      }
    }
  }
}
```

MongoDB Projection
```json
{
  "first_name": true,
  "email": true
}
```

Result
```json
{
  "data": {
    "test1": {
      "_id": "574f263d19bb93d88f1d586d",
      "email": "roberto@gmail.com",
      "firstname": "robert",
      "lastname": "rodrigues"
    },
    "test2": {
      "email": "bill@mail.com",
      "firstname": "bill"
    },
    "test3": {
      "email": "bill@mail.com",
      "firstname": "bill"
    },
    "test4": {
      "edges": [
        {
          "node": {
            "email": "bill@mail.com",
            "firstname": "bill"
          }
        },
        {
          "node": {
            "email": "roberto@gmail.com",
            "firstname": "robert"
          }
        }
      ]
    },
    "test5": {
      "edges": [
        {
          "node": {
            "email": "bill@mail.com",
            "firstname": "bill"
          }
        },
        {
          "node": {
            "email": "roberto@gmail.com",
            "firstname": "robert"
          }
        }
      ]
    }
  }
}
```

## TODO
- create a temporary mongoDB service
