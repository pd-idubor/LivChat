import db from '../models/index.js';


const Users = db.users;
const Posts = db.posts;

class PostsController {
    static async createPost(req, res, next) {
        const user = await Users.findById(req.userId);
        req.session.user = user;
        console.log("Post creation");
        if (req.session.user) {
            try {
                const { title, content } = req.body;
                const post = await new Posts({
                    user: req.session.user.username,
                    title,
                    content,
                    createdAt: new Date()
                });
                post.save().then(post => {
                    Users.findOneAndUpdate({ _id: req.session.user._id }, { $push: { posts: post._id } }, { new: true, useFindAndModify: false })
                        .then(result => {
                            req.session.post_id = post._id;
                            console.log("Post id ", req.session.post_id);
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
                    (console.log({ updated: true, postdata: postId }));
                });

                req.session.post_id = req.params.id;
                console.log("Post updated");
                next();

            } catch (err) {
                console.log(err);
            }
        }
    }

    static async deletePost(req, res, next) {
        console.log("Post deletion");
        const user = await Users.findById(req.userId);
        console.log(req.params);
        req.session.user = user;
        if (req.session.user) {
            console.log("If block")
            try {
                console.log("Try block")
                Users.findOneAndUpdate({ _id: req.session.user._id }, { $pull: { posts: req.params.id } }).then((result) => {
                    console.log("Deleted");
                    next();
                })

            } catch (error) {
                res.status(500).json(error);
            }
        }
    }

    static async getPosts(req, res, next) {
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

    static async getPost(id) {
        const post = await Posts.findById(id);
        if (!post) return ("Not found");
        return post;
    }

}

export default PostsController;