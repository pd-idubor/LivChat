import db from '../models/index.js';


const verifySign = (req, res, next) => {

    // Username
    const Users = db.users;
    Users.findOne({
        username: req.body.username
    }).then((user) => {
        if (user) {
            return res.status(400).json({ message: `Username '${user.username}' is already in use!` });
        }
        if (!user) {

            // Email
            Users.findOne({
                email: req.body.email
            }).then((e_user) => {
                if (e_user) {
                    return res.status(400).json({ message: `Email '${e_user.email}' is already in use!` });
                } else {

                    console.log("New user sign up details verified.");
                    next();
                }
            });
        }
    }).catch((err) => {
        return res.status(500).json({ message: err });
    });
};

export default verifySign;