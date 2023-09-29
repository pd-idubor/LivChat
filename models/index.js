import mongoose from 'mongoose';
import Users from './users.js';
//import role from './role.js';

//console.log(Users);
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.users = Users;
//db.role = role;

//db.ROLES = ["users" , "admin", "moderator"];
//console.log(db);
//console.log(db.users);
export default db;
