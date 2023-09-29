import db from '../models/index.js';
import UsersController from '../controllers/usersController.js'


const verifySign = (req, res, next) => {
  // Username
  console.log("Verifying sign");
  const Users = db.users;
  Users.findOne({
    username: req.body.username
  }).exec((err, user) => {
    if (err) {
    return res.status(500).send({ message: err });
    };
    if (user) {
      return res.status(400).send({ message: 'Username is already in use!' });
    }

    // Email
    console.log("Checking email");
    Users.findOne({
      email: req.body.email
    }).exec((err, user) => {
      if (err) {
        return res.status(500).send({ message: err });
      }

      if (user) {
        return res.status(400).send({ message: 'Email is already in use!' });
      }
      next();
    });
  });
};

export default verifySign;
