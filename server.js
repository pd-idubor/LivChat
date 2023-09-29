import express from 'express';
// require('dotenv').config()
import router from './routes/index.js';
import cookieSession from 'cookie-session'
/*import cookieParser from 'cookie-parser';
import session from 'express-session';
*/
import flash from 'connect-flash';
import cors from "cors";
import dbClient from './utils/db.js';


let corsOptions = {
  origin: "http://localhost:8081"
};


const app = express();
const port = process.env.PORT || 5000;
// set the view engine to ejs
app.set('view engine', 'ejs');

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
app.use(cookieParser());
*/

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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
 
//dbClient;

export default app;
