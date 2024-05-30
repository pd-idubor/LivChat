import express from 'express';
import verifySign from '../utils/verify.js';
import verifyToken from '../utils/auth.js';
import UsersController from '../controllers/usersController.js';
import PostsController from '../controllers/postsController.js';
import FollowsController from '../controllers/followsController.js';
//import db from '../models/index.js';

//const Posts = db.posts;
//const Users = db.users;

const router = express.Router();


router.get('/', function(req, res) {
  res.render('pages/index');
});


router.get('/dashboard/:username', [verifyToken, UsersController.getUser], async (req, res) => {
  const user = req.user;
  const result = await FollowsController.dashContent(req.userId);
  console.log('index', result);
  res.render('pages/dashboard', {
    posts: result,
    user : user
    });
});

router.get('/profile/:username', [verifyToken, UsersController.getUser, PostsController.getPosts], async (req, res) => {
  const user = req.user;
  let followers = await FollowsController.getFollowers(req.userId);
  let following = await FollowsController.getFollowing(req.userId);
  if (followers === undefined ) followers = [];
  if (following === undefined ) following = [];
  console.log('Index: ', followers);
  console.log(following);
    res.render('pages/profile', {
    user: user,
    following: following,
    followers: followers,
    posts: req.posts
  })
});                                                        

router.get('/folprofile/:foluser', [verifyToken], async (req, res) => {
  const follow = await FollowsController.getFolProfile(req.params.foluser);
  console.log('Route:', follow);
  return;
	//}
});

router.get('/flash', function(req, res) {
  req.flash('info', 'Flash is working');
  res.redirect('/');
}
);


// ----------------User routes----------------
router.post('/signup', [UsersController.checkCred, verifySign, UsersController.signUp], function(req, res) {
  res.redirect('dashboard/req.user.username');
});

router.post('/signin', [UsersController.checkSign], UsersController.signIn, function(req, res) {
  res.redirect('dashboard/req.user.username')
});

router.get('/signout', UsersController.signOut, function(req, res) {
  res.redirect('/');
});


// --------------Posts routes-------------------
router.post('/posts/create', [verifyToken, PostsController.createPost], function(req, res) {
  console.log(req);
  res.redirect(`/post/:${req.newPost}`);
});

router.post('/post/:id', [verifyToken], async function(req, res) {
  const post = await PostsController.getPost(req.params.id);
  res.render('pages/edit_post', {post: post});
});


router.post('/posts/update/:id', [verifyToken], PostsController.updatePost);

router.get('/posts/delete/:id', [verifyToken, PostsController.deletePost], function(req, res) {
  res.redirect('/profile/req.user.username');
});

router.get('/posts/:id', [verifyToken], async function(req, res) {
  const post = await PostsController.getPost(req.params.id);
  res.render('pages/single_post', {post: post});
});



// -------------Follow routes-------------------
router.post('/follow/:username', [verifyToken], FollowsController.followAction);



export default router;
