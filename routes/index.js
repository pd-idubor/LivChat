import express from 'express';
import verifySign from '../utils/verify.js';
import verifyToken from '../utils/auth.js';
import UsersController from '../controllers/usersController.js';
import PostsController from '../controllers/postsController.js';
import FollowsController from '../controllers/followsController.js';

//const Posts = db.posts;
//const Users = db.users;

const router = express.Router();


router.get('/', function(req, res) {
    res.render('pages/index');
});

router.get('/dashboard/:username', [verifyToken, UsersController.getUser], async(req, res) => {
    const user = req.user;
    req.session.currentUser = { username: user.username, image: user.image };
    console.log(req.session.currentUser);
    console.log("req.session image: ", req.session.currentUser.image);

    const result = await FollowsController.dashContent(req.userId);
    console.log('User dashboard requested');
    console.log("Dashboard image: ", user.image);
    res.render('pages/dashboard', {
        posts: result,
        user: user
    });
});

router.get('/profile/', [verifyToken, UsersController.getUser, PostsController.getPosts], async(req, res) => {
    console.log("User profile requested");
    const user = req.user;
    let followers = await FollowsController.getFollowers(req.userId);
    // console.log("Request params: ", req.params);
    let following = await FollowsController.getFollowing(req.userId);
    if (followers === undefined) followers = [];
    if (following === undefined) following = [];
    // console.log('Index: ', followers);
    // console.log(following);
    req.session.followers = followers;
    req.session.following = following;
    res.render('pages/profile', {
        user: user,
        following: following,
        followers: followers,
        posts: req.posts
    })
});

router.get('/fellowid/:username', async(req, res) => {
    console.log(req.params.username);
    const id = await FollowsController.getId(req.params.username);
    console.log('Route:', id);
    res.redirect(`/folprofile/${id}`);
});
router.get('/folprofile/:id', [verifyToken, UsersController.getUser, FollowsController.getFellow, FollowsController.getFellowPosts], async(req, res) => {
    console.log(`A fellow's profile was requested with id: ${req.params.id}`);
    let followers = await FollowsController.getFollowers(req.params.id);
    req.session.currentFellow = req.fellow;
    let following = await FollowsController.getFollowing(req.params.id);
    if (followers === undefined) followers = [];
    if (following === undefined) following = [];
    // console.log('Index: ', followers);
    // console.log(following);
    let user = req.user;
    // console.log("This is follow info user: ", user);
    // user.following = req.session.following;
    // console.log("User.following: ", JSON.parse(JSON.stringify(user.following)));
    // console.log("Type", typeof(user.following[3]));
    // console.log(user.following[3]);
    // console.log("User type", typeof(user._id));
    // console.log("UserId: ", user._id);
    res.render('pages/fellow', {
        user: user,
        fellow: req.fellow,
        following: following,
        followers: followers,
        fellowPosts: req.fellowPosts
    })
});


// ----------------User routes----------------
router.post('/signup', [UsersController.checkCred, verifySign, UsersController.signUp], function(req, res) {
    res.redirect('dashboard/req.user.username');
});

router.post('/signin', [UsersController.checkSign], UsersController.signIn, function(req, res) {
    res.redirect('dashboard/req.user.username');
});

router.get('/signout', UsersController.signOut, function(req, res) {
    res.redirect('/');
});



router.get('/chat', function(req, res) {
    if (!req.session.currentUser) return;
    console.log("Chat ali active");
    const user = req.session.currentUser;
    console.log("User name from the chat api: ", user.username);
    console.log("User image from chat api: ", user.image);
    console.log("Req session image: ", req.session.currentUser.image);
    res.send({ username: user.username, image: user.image });
});

// --------------Posts routes-------------------
router.get('/posts', [verifyToken, PostsController.allPosts], function(req, res) {

})
router.get('/postpage', verifyToken, function(req, res) {
    res.render('pages/create_post');
})
router.post('/posts/create', [verifyToken, PostsController.createPost], function(req, res) {
    // console.log("The request object ", req.session);
    console.log("Newpost id ", req.session.post_id);
    res.redirect(`/post/${req.session.post_id}`);
});

router.get('/post/edit/:id', [verifyToken], async function(req, res) {
    console.log('edit subject: ', req.params.id, "\nType: ", typeof(req.params.id));
    const post = await PostsController.getPost(req.params.id);
    res.render('pages/edit_post', { post: post });
});


router.post('/post/update/:id', [verifyToken, PostsController.updatePost], function(req, res) {
    console.log("Postid ", req.session.post_id);
    res.redirect(`/post/${req.session.post_id}`);
});

router.get('/post/delete/:id', [verifyToken, PostsController.deletePost], function(req, res) {
    res.redirect('/profile/req.user.username}');
});

router.get('/post/:id', [verifyToken], async function(req, res) {
    const post = await PostsController.getPost(req.params.id);
    const user = req.session.currentUser.username;
    let fellow;
    if (user !== post.user) fellow = post.user;
    res.render('pages/single_post', { fellow: fellow, post: post });
});



// -------------Follow routes-------------------
router.post('/follow', [verifyToken], FollowsController.followAction, function(req, res) {
    console.log("The followAction function of FollowsController was called!!!");
});

router.all('*', (req, res) => {
    res.render('pages/404');
})

export default router;