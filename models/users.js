import mongoose from 'mongoose';
//import Gravatar from '../utils/gravatar.js';


//const Img = Gravatar;

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
	 //about: String,
    //image: { type: String, default: Img },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Posts"
      }
    ],
    followers: Array,
    following: Array
  })
);

export default Users;
