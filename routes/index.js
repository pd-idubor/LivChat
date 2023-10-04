import express from 'express';
import verifySign from '../utils/verify.js';
import verifyToken from '../utils/auth.js';
import UsersController from '../controllers/usersController.js';
import PostsController from '../controllers/postsController.js';
import FollowsController from '../controllers/followsController.js';
import Users from '../models/users.js';


const router = express.Router();


router.get('/', function(req, res) {
  res.render('pages/index');
});


// ------------Test routes------------
/*router.get('/user', [verifyToken], function(req, res) {
  res.render('pages/dashboard');
});
*/
router.get('/sock', (req, res) => {
  res.sendFile(new URL('../index.html', import.meta.url).pathname);
});

router.get('/dashboard/:username', [verifyToken, UsersController.getUser], (req, res) => {
  const user = req.user;
  res.render('pages/dashboard', {
        user : user
    });
});

router.get('/profile/:username', [verifyToken, UsersController.getUser], (req, res) => {
  const user = req.user;
  console.log(user);
  res.render('pages/profile', {
    following: user.following.length,
    followers: user.followers.length,
    posts: user.posts.length
  })
});                                                        

router.get('/flash', function(req, res) {
  req.flash('info', 'Flash is working');
  res.redirect('/');
}
);
router.get('/api/auth/user/', [verifyToken], UsersController.getUser);

router.post('/api/auth/check', function(req, res) {
  res.json(req.session);
  res.json('Works');
});


// ----------------User routes----------------
router.post('/signup', [UsersController.checkCred, verifySign, UsersController.signUp], function(req, res) {
  res.redirect('pages/dashboard');
});

router.post('/signin', [UsersController.checkCred], UsersController.signIn, function(req, res) {
  res.redirect('pages/dashboard')
});

router.get('/signout', UsersController.signOut);


// --------------Posts routes-------------------
router.post('/posts/create', [verifyToken], PostsController.createPost);

router.get('/posts/count', [verifyToken], PostsController.postCount);

router.post('/posts/update/:id', [verifyToken], PostsController.updatePost);
router.get('/posts/delete/:id', [verifyToken], PostsController.deletePost);
router.get('/posts/:username', [verifyToken], PostsController.getPosts);


// -------------Follow routes-------------------
router.post('/follow/:username', [verifyToken], FollowsController.followAction);
router.get('/follow/count', [verifyToken], FollowsController.countFollowers);
router.get('/following/count', [verifyToken], FollowsController.countFollowing);

//router.get('/dashboard', [verifyToken], FollowsController.dashUser);


export default router;
