import jsonwebtoken from 'jsonwebtoken';
import config from './config.js';



const verifyToken = async (req, res, next) => {
  console.log(req);
  console.log(req.headers.cookie);
  if (req.headers.cookie) req.session.token = req.headers.cookie.split('=')[1];
  console.log(req.session);
  let token = req.session.token;
  console.log(token);

  const jwt = jsonwebtoken;
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token,
            config.secret,
            (err, decoded) => {
              if (err) {
                return res.status(401).send({
                  message: "Unauthorized!",
                });
              }
              req.userId = decoded.id;
              next();
            });
};

export default verifyToken;
