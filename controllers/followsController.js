import graVatar from '../utils/gravatar.js';
import db from '../models/index.js';



const Users = db.users;
const Posts = db.posts;
//Follower - c'est moi ou current user et following - un ami

class FollowsController {
    static async followAction(req, res, next) {
        let { follower, following, action } = req.body;
        
        try {
            switch (action) {
                case 'follow':
                    await Promise.all([
                        Users.findByIdAndUpdate(follower, { $push: { following: following } }),
                        Users.findByIdAndUpdate(following, { $push: { followers: follower } })
                    ]);
                    req.flash('success', 'You followed this user');
		    next();
		    break;
                case 'unfollow':
                    await Promise.all([
                        Users.findByIdAndUpdate(follower, { $pull: { following: following } }),
                        Users.findByIdAndUpdate(following, { $pull: { followers: follower } })
                    ]);
                    req.flash('success', 'You unfollowed this user');
		    next();
		    break;
                default:
                    break;
            }
            next();
        } catch (err) {
            req.flash('error', 'Unsuccessful action');
	    console.log(err);
        }
    }

    static async dashContent(id) {
        console.log("Get following content");
        try {
            const user = await Users.findById(id);
            const follows = user['following'];
            if (follows === undefined || follows.length == 0) return;

            let followsList = [];
            let postsList = [];
            await follows.reduce(async(promise, follow) => {
                await promise;
                if (follow !== null) {
                    const data = await Posts.find({ 'user': follow.username });
                    for (let i = 0; i < data.length; i++) {
                        postsList.push(data[i]);
                    }
                }
            }, Promise.resolve());
            postsList = postsList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            const result = postsList.slice(0, 10);
            return (result);
        } catch (err) {
            console.log(err);
        }
    }

    static async getFollowing(id) {
        try {
            const user = await Users.findById(id).populate('posts');
            const follows = user['following'];

            if (follows === undefined || follows.length == 0) return;

            let followsList = [];
            await follows.reduce(async(promise, follow) => {
                await promise;
                if (follow !== null) {
                    let data = await Users.findById(follow._id);
                    //Gravatar image
                    const image = await graVatar(data.email);
                    const { url } = image;
                    data.image = url;

                    followsList.push(data);
                }
            }, Promise.resolve());
            return (followsList);
        } catch (err) {
            console.log(err);
        }
    }
    static async getFollowers(id) {
        try {
            const user = await Users.findById(id).populate('posts');

            const follows = user['followers'];
            if (follows === undefined || follows.length == 0) return;

            let followsList = [];
            await follows.reduce(async(promise, follow) => {
                await promise;
                if (follow !== null) {
                    const data = await Users.findById(follow._id);
                    //Gravatar image
                    const image = await graVatar(data.email);
                    const { url } = image;
                    data.image = url;

                    followsList.push(data);
                }
            }, Promise.resolve());

            return (followsList);

        } catch (err) {
            console.log(err);
        }
    }

    static async getId(name) {
        try {
            const fellow = await Users.findOne({ 'username': name });
            console.log("Fellow id: ", fellow._id);
            return (fellow._id);
        } catch (err) {
            console.log(err);
        }
    }

    static async getFellow(req, res, next) {
        try {
            let fellow = await Users.findById(req.params.id).populate('posts', 'followers');
            if (!fellow) console.log('No fellow');
            const image = await graVatar(fellow.email);
            const { url } = image;
            fellow.image = url;
            req.fellow = fellow;
            next();
        } catch (e) {
            console.log(e);
            req.flash('error', 'Could not retrieve user');
	    return res.redirect('/profile');
        }
    }

    static async getFellowPosts(req, res, next) {
        const fellow = await Users.findById(req.params.id).populate('posts');
        if (!fellow) return console.log("User not found for all posts");
        try {
            let posts = fellow['posts'];
            posts = posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            req.fellowPosts = posts;
            next();
        } catch (err) {
            console.log(err);
        }
    }

}
export default FollowsController;
