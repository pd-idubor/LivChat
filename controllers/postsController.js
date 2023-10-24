import db from '../models/index.js';


const Users = db.users;
const Posts = db.posts;

class PostsController {
  static async createPost (req, res, next) {
    const user = await Users.findById(req.userId);
    req.session.user = user;
    console.log("Post creation");
    if(req.session.user) {
        try {
          const { title, content } = req.body;
          const post = await new Posts({
	    user: req.session.user.username,
	    title,
            content,
	    createdAt: new Date()
	  });
	  post.save().then(post => {
                        Users.findOneAndUpdate(
			{ _id: req.session.user._id},
			{ $push: { posts: post._id } },
			{ new: true, useFindAndModify: false })
			.then(result => {
                        req.newPost = post._id;
			console.log({ created: true, postid: post._id });
                        });
	  });
	next();
	} catch(err) {
            console.log(err);
        }
    } else {
        console.log("No user in req.session");
    }

  }
  

  static async updatePost (req, res, next) {
    console.log("Post update");
    const user = await Users.findById(req.userId);
    req.session.user = user;
    if (req.session.user) {
      try{
	const post = Post.findById(req.params.id);
	if (!post) return res.json('No such post');
	const { title, content } = req.body;
	Users.findOneAndUpdate(
             { _id: req.session.user._id,
	     "posts._id": req.params.id },
	      { $set: { "posts.$.title": title, "posts.$.content": content }
	      }, (err, data) => {(console.log({ updated: true, postdata: data}))
	      });
		      console.log("Post updated");
	    
      next();
      } catch (err) {
	  //res.json(err);
	  console.log(err);
      }
    }
  }
  
  static async deletePost (req, res, next) {
    console.log("Post creation");
    const user = await Users.findById(req.userId);
    req.session.user = user;
    if(req.session.user) {
      try {
	Users.findOneAndUpdate( { _id: user._id }, {$pull: {posts: req.params.id}}, (err, data) => {
    if (err) {
        return res.status(500).json({ error: 'error in deleting address' });
    }
    res.json(data);   
});
	     //res.json('Post deleted');
    next();
    } catch (error) {
      res.status(500).json(error);
    }
    }
  }

  static async getPosts (req, res, next) {
    console.log("All your posts");
    const user = await Users.findById(req.userId).populate('posts');
    if (!user) return res.json("User not found for all posts");
    try {
      let posts = user['posts'];
      posts = posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      req.posts = posts;
      console.log(req.posts);
      next();
    } catch (err) {
      console.log(err);
    }
  }

  static async getPost (id) {
    const post = await Posts.findById(id);
    if (!post) return("Not found");
    return post;
  }

}

export default PostsController;
