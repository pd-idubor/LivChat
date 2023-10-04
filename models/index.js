import mongoose from 'mongoose';
import Users from './users.js';
import Posts from './posts.js';


mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.users = Users;
db.posts = Posts;


export default db;
