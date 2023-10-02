import mongoose from 'mongoose';
import Users from './users.js';
import Posts from './posts.js';

//console.log(Users);
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.users = Users;
db.posts = Posts;

//console.log(db);
//console.log(db.users);
console.log(db.posts);


export default db;
