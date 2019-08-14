import mongoose from 'mongoose'

import UserModel from './userModel'

import mockUsers from './users'

const mongooseOpts = {
  autoIndex: false,
  useNewUrlParser: true,
  useFindAndModify: false
}

export const connectMongoose = async () => {
  jest.setTimeout(10000)
  return mongoose.connect(global.__MONGO_URI__, {
    ...mongooseOpts,
    dbName: global.__MONGO_DB_NAME__,
    useCreateIndex: true
  })
}

export async function connectMongooseAndPopulate() {
  const connection = await connectMongoose()
  await UserModel.insertMany(mockUsers)
  return connection
}

export async function clearDB() {
  await mongoose.connection.db.dropDatabase()
}

export async function disconnectMongoose() {
  return mongoose.disconnect()
}
