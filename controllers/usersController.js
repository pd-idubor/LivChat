import validator from 'validator';
import db from "../models/index.js";
import jsonwebtoken from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import verifySign from '../utils/verify.js';
import config from '../utils/config.js';


//console.log(db);
const check = validator;
const Users = db.users;
const jwt = jsonwebtoken;


class UsersController {
  static checkCred (req, res, next) {
    console.log("Checking");
    const { username, email, password } = req.body;
    if (!username) return res.status(400).json({ error: 'Missing username' });
    if (!email || !check.isEmail(email)) {
      return res.status(400).json({ error: 'Please enter a valid email'});
    }
    if (!password || !check.isLength(password, {min: 6})) {
      return res.status(400).json({ error: 'Please enter a valid password' });
    }
    console.log("Checked");
    next();
  }

  static async signUp (req, res) {
  //Save user
    console.log("Creating new user");
    const { username, email, password } = req.body;
    const user = await new Users({
      username,
      email,
      password
    });
  
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    console.log("Saving");
    await user.save(); /*((err, user)=> {
      if (err) {
        res.status(500).send({ message: err });
      };
    });
  */
    //next();
    console.log("Saved");
    try {
      const token = jwt.sign({ id: user.id }, config.secret,
	    {
              algorithm: 'HS256',
              expiresIn: 86400,
	    });
    req.session.user = user;
    req.session.token = token;

    //req.flash('success', `Welcome ${username}`);
    // Redirect with- res.redirect('/users'); to dashboard
    res.status(200).send({
      id: user._id,
      username: user.username,
      email: user.email,
      token: token,
    })
    } catch(err) {
	console.log(err);
    }
    //return res.render('pages/profile');
  }

  static async signIn (req, res) {
    await Users.findOne({
      username: req.body.username,
    })
      .exec((err, user) => {
        if (err) {
          return res.status(500).send({ message: err });
        }

        if (!user) {
          return res.status(404).send({ message: "User Not found." });
        }

        const hash = bcrypt.compare(req.body.password, user.password);
        if (!hash) {
          return res.status(401).json({message: "Incorrect Password !"});
	}
	try {
          const token = jwt.sign({ id: user.id },
		  config.secret,
		  {
			  algorithm: 'HS256',
                          expiresIn: 86400,
                  });

        req.session.user = user;
	req.session.token = token;

        //req.flash('success', 'You\'re in');
	console.log(user);
	res.status(200).send({
          id: user._id,
          username: user.username,
          email: user.email,
          token: req.session.token,
        });
	} catch (err) {
    	  console.log(err);
	}
      });
 };

  static signOut (req, res) {
    /*req.session.destroy((err) => {
      if (err) {
      console.log(err);
      } else {
        res.redirect('/login');
      }
    });*/
    try {
      req.session = null;
      return res.status(200).send({ message: "You've been signed out!"});
      // req.flash('success', 'You logged out!');
      //res.redirect('/');
    } catch (err) {
      this.next(err);
    }
    req.flash('success', 'You\'ve logged out!');
    res.redirect('/');
  }
  
  static async getContent (req, res) {
    try {
    // request.user is getting fetched from Middleware after token authentication
      const user = await Users.findById(req.userId);
      if (!user) console.log('No user');
      console.log(Users);
      console.log(user);
      res.json(user);
      req.flash('success', 'Content gotten');
    } catch (e) {
      console.log(e);
      return res.send("Error in retrieving user");
    }
  }
}

export default UsersController;
