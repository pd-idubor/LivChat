//const express = require('express');
//const session = require('express-session');
const flash = require('connect-flash');
// require('dotenv').config()
//const cors = require("cors");
//const cookieSession = require("cookie-session");
import router from './routes/index.js';
import cookieSession from 'cookie-session'
import cookieParser from 'cookie-parser';
import session from 'express-session';
/* const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
*/
import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import flash from 'connect-flash';
import cors from "cors";
import dbClient from './utils/db.js';

//const { Server } = pkg;

let corsOptions = {
  origin: "http://localhost:8081"
};


const app = express();
const port = process.env.PORT || 5000;
// set the view engine to ejs
app.set('view engine', 'ejs');

//app.use(express.static("public"));

// Make sure you place body-parser before your CRUD handlers!
app.use(express.urlencoded({ extended: true }))

//cookieSession
app.use(
  cookieSession({
    name: "livchat-session",
    keys: ["COOKIE_SECRET"], // should use as secret environment variable
    httpOnly: true
  })
);


/*app.use(session({
  secret: "livchat2812",
  saveUninitialized:true,
  cookie: { maxAge: 86400},
  resave: false
}));
*/
app.use(cookieParser());


//app.enable('trust proxy');
app.use(cors(corsOptions));
// Use this middelware parser for forms?
app.use(express.json());

//Falsh messaging
app.use(flash());
/*app.use(flash());
app.use((req, res, next) =>{
  res.locals.flashMessages = req.flash();
	
});
*/
//ath
app.use(function(req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, Content-Type, Accept"
  );
  next();
});

app.use('/', router);

dbClient;

const server = createServer(app);
const io = require('socket.io')(server);

io.on('connection', (socket) => {
  console.log('a user connected');
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
 
//dbClient;


export default app;
