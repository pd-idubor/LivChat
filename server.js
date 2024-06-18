import router from './routes/index.js';
import cookieSession from 'cookie-session'
import cookieParser from 'cookie-parser';
import flash from 'connect-flash';
import cors from "cors";
import dbClient from './utils/db.js';
import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';



let corsOptions = {
    origin: "http://localhost:8080"
};


const app = express();
const server = createServer(app);
const io = new Server(server);

const port = process.env.PORT || 5000;

// Set the view engine to ejs
app.set('view engine', 'ejs');

// Static files
app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

//cookieSession
app.use(
    cookieSession({
        name: "livchat-session",
        keys: ["COOKIE_SECRET"],
        httpOnly: true
    })
);

app.use(cookieParser());


//app.enable('trust proxy');
app.use(cors(corsOptions));

//Flash messaging
app.use(flash());
app.use(function(req, res, next) {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});



app.use(function(req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, Content-Type, Accept"
    );
    next();
});

app.use('/', router);

dbClient;

io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('disconnect', function() {
        console.log('Client disconnected.');
    });
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


export default server;