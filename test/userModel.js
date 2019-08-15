import mongoose, { Schema } from 'mongoose'

const AchievementSchema = new Schema({
  type: String,
  timestap: Number
})

const ProfileSchema = new Schema(
  {
    avatar: String,
    achievements: [AchievementSchema]
  },
  { _id: false }
)

const DeepSchema = new Schema({
  deepLevel: Number,
  otherField: String
})

const NestedSchema = new Schema({
  level: Number,
  otherField: String,
  deep: DeepSchema
})

const UserSchema = new Schema({
  email: String,
  firstname: String,
  lastname: String,
  verified: Boolean,
  profile: ProfileSchema,
  friends: [Schema.Types.ObjectId],
  nested: NestedSchema
})

export default mongoose.model('User', UserSchema)
