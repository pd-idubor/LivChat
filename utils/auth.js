import jsonwebtoken from 'jsonwebtoken';
import config from './config.js';


const verifyToken = async(req, res, next) => {
    let token = req.session.token;

    const jwt = jsonwebtoken;
    if (!token) {
        req.flash('error', "Session expired!\nPlease login");
	return res.redirect('/');
    }

    jwt.verify(token,
        config.secret,
        (err, decoded) => {
            if (err) {
                req.flash('error', "Unauthorized!");
		return res.redirect;
            }
            req.userId = decoded.id;
            next();
        });
};

export default verifyToken;
