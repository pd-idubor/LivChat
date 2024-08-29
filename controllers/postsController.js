import db from '../models/index.js';


const Users = db.users;
const Posts = db.posts;

class PostsController {
    static async createPost(req, res, next) {
        const user = await Users.findById(req.userId);
        req.session.user = user;
        if (req.session.user) {
            try {
                const { title, content } = req.body;
                const post = new Posts({
                    user: req.session.user.username,
                    title,
                    content,
                    createdAt: new Date()
                });
                post.save().then(post => {
                    Users.findOneAndUpdate({ _id: req.session.user._id }, { $push: { posts: post._id } }, { new: true, useFindAndModify: false })
                        .then(result => {
                            req.session.post_id = post._id;
                            req.flash('success', 'New post created');
			    console.log({ created: true, postid: post._id });
                            next();
                        });
                });
                return;
            } catch (err) {
                console.log(err);
            }
        } else {
            console.log("No user in req.session");
        }

    }


    static async updatePost(req, res, next) {
        console.log("Post update");
        const user = await Users.findById(req.userId);
        req.session.user = user;
        if (req.session.user) {
            try {
                const { title, content } = req.body;
                Posts.findOneAndUpdate({
                    _id: req.params.id
                }, {
                    $set: { title: title, content: content }
                }).then(result => {
                    (console.log({ updated: true, postdata: req.params.id }));
                });

                req.session.post_id = req.params.id;
                req.flash('success', 'Post update successful');
		console.log("Post updated");
                next();

            } catch (err) {
                console.log(err);
            }
        }
    }

    static async deletePost(req, res, next) {
        const user = await Users.findById(req.userId);
        req.session.user = user;
        if (req.session.user) {
            try {
                Users.findOneAndUpdate({ _id: req.session.user._id }, { $pull: { posts: req.params.id } }).then((result) => {
                    console.log("Post deletion successful");
                    next();
                })

            } catch (error) {
                res.status(500).json(error);
            }
        }
    }

    static async getPosts(req, res, next) {
        const user = await Users.findById(req.userId).populate('posts');
        if (!user) return res.json("User not found for all posts");
        try {
            let posts = user['posts'];
            posts = posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            req.posts = posts;
            console.log("All posts retrieved");
            next();
        } catch (err) {
            console.log(err);
        }
    }

    static async getPost(id) {
        const post = await Posts.findById(id);
        if (!post) return ("Not found");
        return post;
    }

    static async allPosts(req, res, next) {
        const posts = await Posts.find();
        // console.log(posts);
        if (!posts) return res.json("The database has no posts");
        try {
            res.send(posts);
            console.log("Database posts retrieved");
            next();
        } catch (err) {
            console.log(err);
        }
    }
}

export default PostsController;
