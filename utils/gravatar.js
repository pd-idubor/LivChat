import crypto from "crypto";
import request from "request";


const Gravatar = (req, res, next) => {

  let hash = crypto.createHash('md5').update(user.email).digest("hex");

  /* Sends a GET request for the avatar */
  request("https://www.gravatar.com/avatar/"+hash+".jpg",function(err,res, data){
    if (!err){
      req.userImg = body; 
      console.log("Reaponse: ", res);
      console.log("Got image: ", data);
    }else{
      console.log("Image Error: "+err);
    }
  next();
  }
);
}

export default Gravatar;
