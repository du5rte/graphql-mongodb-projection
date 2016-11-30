import Koa from 'koa'
import logger from 'koa-logger'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'
import mongo, { MongoClient } from 'mongodb'
import { graphqlKoa, graphiqlKoa } from 'graphql-server-koa'
import schema from './schema'

const app = new Koa()
const router = new Router()
const PORT = 3000
const MONGO_URI = "mongodb://localhost:27017/test"

// Middleware
app.use(logger())
app.use(bodyParser())

// Routes
router.all('/graphql', graphqlKoa({ schema }))
router.get('/graphiql', graphiqlKoa({ endpointURL: '/graphql' }))
app.use(router.routes())
app.use(router.allowedMethods())


!(async () => {
  try {
    mongo.db = await MongoClient.connect(MONGO_URI)
    // Print Schema for Relay
    // updateSchema(schema)

    app.listen(PORT)
  } catch(err) {
    console.error(err)
    process.exit(1)
  } finally {
    console.log(`server running on localhost:${PORT}, database ${MONGO_URI}`)
  }
})()
