import express from 'express';
import verifySign from '../utils/verify.js';
import verifyToken from '../utils/auth.js';
import UsersController from '../controllers/usersController.js';
import PostsController from '../controllers/postsController.js';
import FollowsController from '../controllers/followsController.js';


const router = express.Router();

router.get('/', function(req, res) {
    res.render('pages/index');
});

router.get('/dashboard/:username', [verifyToken, UsersController.getUser], async(req, res) => {
    const user = req.user;
    req.session.currentUser = { username: user.username, image: user.image };

    const result = await FollowsController.dashContent(req.userId);
    res.render('pages/dashboard', {
        posts: result,
        user: user
    });
});

router.get('/profile/', [verifyToken, UsersController.getUser, PostsController.getPosts], async(req, res) => {

    const user = req.user;
    let followers = await FollowsController.getFollowers(req.userId);
    let following = await FollowsController.getFollowing(req.userId);
    if (followers === undefined) followers = [];
    if (following === undefined) following = [];

    req.session.followers = followers;
    req.session.following = following;
    res.render('pages/profile', {
        user: user,
        following: following,
        followers: followers,
        posts: req.posts
    })
});

router.get('/fellowid/:username', [verifyToken], async(req, res) => {
    console.log(req.params.username);
    const id = await FollowsController.getId(req.params.username);
    res.redirect(`/folprofile/${id}`);
});

router.get('/folprofile/:id', [verifyToken, UsersController.getUser, FollowsController.getFellow, FollowsController.getFellowPosts], async(req, res) => {
    let followers = await FollowsController.getFollowers(req.params.id);
    req.session.currentFellow = req.fellow;
    let following = await FollowsController.getFollowing(req.params.id);
    if (followers === undefined) followers = [];
    if (following === undefined) following = [];
    let user = req.user;
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
    const user = req.session.currentUser;
    res.send({ username: user.username, image: user.image });
});

// --------------Posts routes-------------------
router.get('/posts', [verifyToken, PostsController.allPosts], function(req, res) {

})
router.get('/postpage', verifyToken, function(req, res) {
    res.render('pages/create_post');
})
router.post('/posts/create', [verifyToken, PostsController.createPost], function(req, res) {
    res.redirect(`/post/${req.session.post_id}`);
});

router.get('/post/edit/:id', [verifyToken], async function(req, res) {
    const post = await PostsController.getPost(req.params.id);
    res.render('pages/edit_post', { post: post });
});


router.post('/post/update/:id', [verifyToken, PostsController.updatePost], function(req, res) {
    res.redirect(`/post/${req.session.post_id}`);
});

router.get('/post/delete/:id', [verifyToken, PostsController.deletePost], function(req, res) {
    res.redirect('/profile/');
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
});

router.all('*', (req, res) => {
    res.render('pages/404');
})

export default router;
