import graVatar from '../frontend-js/gravatar.js';
import db from '../models/index.js';



const Users = db.users;
const Posts = db.posts;
//Follower - c'est moi ou current user et following - un ami

class FollowsController {
    static async followAction(req, res, next) {
        let { follower, following, action } = req.body;
        // Get following(friends) userId subsequently
        console.log(req.userId);
        if (req.userId) {
            let follower = req.userId;
        }
        console.log('Follower id:', typeof(follower), follower);
        console.log('Following id:', typeof(following), following);
        try {
            switch (action) {
                case 'follow':
                    await Promise.all([
                        Users.findByIdAndUpdate(follower, { $push: { following: following } }),
                        Users.findByIdAndUpdate(following, { $push: { followers: follower } })
                    ]);
                    break;
                case 'unfollow':
                    await Promise.all([
                        Users.findByIdAndUpdate(follower, { $pull: { following: following } }),
                        Users.findByIdAndUpdate(following, { $pull: { followers: follower } })
                    ]);
                    break;
                default:
                    break;
            }
            res.json({ done: true });

        } catch (err) {
            res.json({ done: false });
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
            console.log('Controller', result);
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
            console.log(followsList);
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

            console.log(followsList);
            return (followsList);

        } catch (err) {
            console.log(err);
        }
    }

    static async getFolProfile(name) {
        try {
            const user = await Users.find({ 'username': name }).populate('posts');
            const posts = user['posts'];
            let postList = [];
            console.log('Fol-user name:', user);
            if (posts === undefined) return (console.log("This user has no posts"));
            await posts.reduce(async(promise, post) => {
                await promise;
                if (follow !== null) {
                    const data = await Posts.findById(post._id);
                    postList.push(data);
                }
            }, Promise.resolve());
            console.log(user, postList);
        } catch (err) {
            console.log(err);
        }
    }

}
export default FollowsController;