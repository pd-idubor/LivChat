import mongoose from 'mongoose';


const Users = mongoose.model(
  "Users",
  new mongoose.Schema({
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    about: {
      type: String,
      default: 'This displays user info'
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Posts"
      }
    ],
    followers: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Users' }
    ],
    following: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Users' }
    ],
  })
);

export default Users;
