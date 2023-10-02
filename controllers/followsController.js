import db from '../models/index.js';


const Users = db.users;
//Replace follower with moi ou current user and following with ami

class FollowsController {
  static async followAction (req, res, next) {
    let { follower, following, action } = req.body;
    // You have tonget following(friends) userId subsequently
     console.log(req.userId);
     if (req.userId) {
       let follower = req.userId;
     }
     console.log('Follower id:', typeof(follower), follower);
     console.log('Following id:', typeof(following),following);
     try {
      switch(action) {
        case 'follow':
          await Promise.all([ 
            Users.findByIdAndUpdate(follower, { $push: { following: following }}),
            Users.findByIdAndUpdate(following, { $push: { followers: follower }})
	  ]);
	break;
	case 'unfollow':
          await Promise.all([ 
         Users.findByIdAndUpdate(follower, { $pull: { following: following }}),
          Users.findByIdAndUpdate(following, { $pull: { followers: follower }})
	  ]);
        break;
	default:
          break;
      }
      res.json({ done: true });
    
    } catch(err) {
      res.json({ done: false });
    }
  }

  static async dashContent (req, res, next) {
    console.log("Get following content");
    try {
      const user = await Users.findById(req.userId);
      if (!user) return res.json("No user found");
      const id = user._id;
      console.log(id);
      const cursor = await Users.findById(id).populate('following');
      console.log(cursor);
      const fol = user['following'];
      console.log(fol);
      const posts = fol.forEach(myFunction);
      function myFunction(follow_id, index, arr) {
	      //Users.findById(follow_id).populate('posts').limit(5);
	      arr[index] = follow_id;
	      if (follow_id) {
		console.log('Glow', follow_id['posts']);
	      }
      }
      console.log(posts);
	      //;   
    } catch (e) {
      console.log(e);
    } 
}

  static async countFollowers (req, res, next) {
    try {
      const user = await Users.findById(req.userId);
      if (!user) return res.json("No user found");
      res.json(user.followers.length);
    } catch (err) {
       console.log(err);
    }
  }

   static async countFollowing (req, res, next) {
    try {
      const user = await Users.findById(req.userId);
      if (!user) return res.json("No user found");
      res.json(user.following.length);
    } catch (err) {
	console.log(err);
    }
   }

}
export default FollowsController;
