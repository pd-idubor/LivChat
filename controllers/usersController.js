import validator from 'validator';
import db from "../models/index.js";
import jsonwebtoken from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import config from '../utils/config.js';
import graVatar from '../utils/gravatar.js';


const check = validator;
const Users = db.users;
const jwt = jsonwebtoken;


class UsersController {
    static checkCred(req, res, next) {
        const { username, email, password } = req.body;
        if (!username) return res.status(400).json({ error: 'Missing username' });
        if (!email || !check.isEmail(email)) {
            return res.status(400).json({ error: 'Please enter a valid email' });
        }
        if (!password || !check.isLength(password, { min: 6 })) {
            return res.status(400).json({ error: 'Please enter a valid password' });
        }
        console.log("Login credentials checked");
        next();
    }

    static checkSign(req, res, next) {
        const { username, password } = req.body;
        if (!username) return res.status(400).json({ error: 'Missing username' });
        if (!password || !check.isLength(password, { min: 6 })) {
            return res.status(400).json({ error: 'Please enter a valid password' });
        }
        console.log("New login details checked");
        next();
    }

    static async signUp(req, res, next) {
        console.log("Signing up new user");
        const { username, email, password } = req.body;
        const user = new Users({
            username,
            email,
            password
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        try {
            const token = jwt.sign({ id: user.id }, config.secret, {
                algorithm: 'HS256',
                expiresIn: 86400,
            });
            req.session.user = user;
            req.session.token = token;

            console.log(req.session.token);
            req.flash('success', `Welcome ${username}`);

            console.log("Welcome new user");
            next();
        } catch (err) {
            res.json(err);
            console.log(err);
        }
    }

    static async signIn(req, res, next) {
        await Users.findOne({
                username: req.body.username,
            })
            .then((user) => {
                if (!user) {
                    return res.status(404).json({ message: "User Not found." });
                }

                const hash = bcrypt.compare(req.body.password, user.password);
                if (!hash) {
                    return res.status(401).json({ message: "Incorrect Password !" });
                }
                try {
                    const token = jwt.sign({ id: user.id },
                        config.secret, {
                            algorithm: 'HS256',
                            expiresIn: 86400,
                        });

                    req.session.user = user;
                    req.session.token = token;

                    req.flash('success', 'You\'re logged in');
                    console.log("Successful signin with token: ", req.session.token);

                    next();
                } catch (err) {
                    res.json(err);
                    console.log(err);
                }
            }).catch((err) => {
                return res.status(500).send({ message: err });
            });
    };

    static signOut(req, res, next) {
        try {
            req.session = null;
            next();
        } catch (err) {
            console.log(err);
        }
    }

    static async getUser(req, res, next) {
        try {
            let user = await Users.findById(req.userId).populate('posts', 'followers');
            if (!user) console.log('No user');
            const image = await graVatar(user.email);
            const { url } = image;
            user.image = url;
            req.user = user;
            console.log("User details including avatar successfully retrieved!")
            next();
        } catch (e) {
            console.log(e);
            return res.json("Error in retrieving user");
        }
    }
}

export default UsersController;