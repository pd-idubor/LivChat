
/* Load the packages for hashing and HTTP requests (must be installed with npm before) */
import crypto from "crypto";
import request from "request";


const Gravatar = (req, res, next) => {

  /* Generate a md5-hash of a email address and return its hexadecimal value */
  let hash = crypto.createHash('md5').update(user.email).digest("hex");

  /* Sends a GET request for the user profile */
/* request("https://www.gravatar.com/"+hash+".xml",function(err,response,body){
    if (!err){
      console.log(body);
    }else{
      console.log("Profile Error: "+err);
    }
  })
*/
  /* Sends a GET request for the avatar */
  request("https://www.gravatar.com/avatar/"+hash+".jpg",function(err,response,body){
    if (!err){
      console.log("Got image: "+body);
    }else{
      console.log("Image Error: "+err);
    }
  next();
  }
);
}
export default Gravatar;
