import mongoose from'mongoose';


const Posts = mongoose.model(
  "Posts",
  new mongoose.Schema({
    user: String,
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    createdAt: Date
  })
);

export default Posts;
