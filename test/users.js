import mongoose from 'mongoose'

const id1 = mongoose.Types.ObjectId()
const id2 = mongoose.Types.ObjectId()
const id3 = mongoose.Types.ObjectId()
const id4 = mongoose.Types.ObjectId()
const id5 = mongoose.Types.ObjectId()
export default [
  {
    _id: '583f1607bf98f7f846e7d2d1',
    email: 'leonardodicaprio@mail.com',
    firstname: 'Leonardo',
    lastname: 'Di Caprio',
    verified: true
  },
  {
    _id: '583f1607bf98f7f846e7d2d2',
    email: 'bradpitt@mail.com',
    firstname: 'Brad',
    lastname: 'Pitt',
    profile: {
      avatar: 'cat.jpg',
      achievements: [
        {
          type: 'created_account',
          timestap: 1525905846
        },
        {
          type: 'authenticated_with_email',
          timestap: 1525988646
        },
        {
          type: 'authenticated_with_facebook',
          timestap: 1526507046
        },
        {
          type: 'logged_in',
          timestap: 1528580646
        }
      ]
    },
    friends: [
      '583f1607bf98f7f846e7d2d1',
      '583f1607bf98f7f846e7d2d3',
      '583f1607bf98f7f846e7d2d4'
    ],
    verified: true
  },
  {
    _id: '583f1607bf98f7f846e7d2d3',
    email: 'christianbale@mail.com',
    firstname: 'Christian',
    lastname: 'Bale',
    verified: false
  },
  {
    _id: '583f1607bf98f7f846e7d2d4',
    email: 'johndoe@mail.com',
    verified: true
  },
  {
    _id: '583f1607bf98f7f846e7d2d5',
    email: 'aprilSmith@mail.com',
    verified: true,
    nested: {
      level: 2,
      otherField: 'one',
      deep: {
        deepLevel: 3,
        otherField: 'two'
      }
    }
  }
]