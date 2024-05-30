import db from '../models/index.js';
import UsersController from '../controllers/usersController.js'


const verifySign = (req, res, next) => {
  // Username
  console.log("Verifying sign");
  const Users = db.users;
  Users.findOne({
    username: req.body.username
  }).then((user) => {
      if (user) {
      	return res.status(400).json({ message: `Username '${user.username}' is already in use!` });
      }
      if (!user) {
       	// Email
    	console.log("Checking email");
    	Users.findOne({
      	  email: req.body.email
	}).then((e_user) => {
        if (e_user) {
	  return res.status(400).json({ message: `Email '${e_user.email}' is already in use!` });
	}
        else{
	  next();
	}
	});
      }
  }).catch((err) => {
	 return res.status(500).json({ message: err });
      });
};

export default verifySign;
