import express from 'express';
import verifySign from '../utils/verify.js';
import verifyToken from '../utils/auth.js';
import UsersController from '../controllers/usersController.js';
//import AuthController from '../controllers/AuthController';
import PostsController from '../controllers/postsController.js';
import FollowsController from '../controllers/followsController.js';


const router = express.Router();

// ------------Landing page-----------
router.get('/', function(req, res) {
  res.render('pages/land_page');
});


// ------------Test routes------------
/*router.get('/user', [verifyToken], function(req, res) {
  res.render('pages/dashboard');
});
*/
router.get('/sock', (req, res) => {
  res.sendFile(new URL('../index.html', import.meta.url).pathname);
});


router.get('/flash', function(req, res) {
  req.flash('info', 'Flash is working');
  res.redirect('/');
}
);
router.get('/api/auth/user/', [verifyToken], UsersController.getContent);

router.post('/api/auth/check', function(req, res) {
  res.json(req.session);
  res.json('Works');
});


// ----------------User routes----------------
router.post('/api/auth/signup', [UsersController.checkCred, verifySign], UsersController.signUp);

router.post('/api/auth/signin', [UsersController.checkCred], UsersController.signIn);

router.get('/api/auth/signout', UsersController.signOut);


// --------------Posts routes-------------------
router.post('/posts/create', [verifyToken], PostsController.createPost);

router.get('/posts/count', [verifyToken], PostsController.postCount);

router.post('/posts/update/:id', [verifyToken], PostsController.updatePost);
router.get('/posts/delete/:id', [verifyToken], PostsController.deletePost);
router.get('/posts', [verifyToken], PostsController.getPosts);


// -------------Follow routes-------------------
router.post('/follow', [verifyToken], FollowsController.followAction);
router.get('/follow/count', [verifyToken], FollowsController.countFollowers);
router.get('/following/count', [verifyToken], FollowsController.countFollowing);
router.get('/dashboard', [verifyToken], FollowsController.dashContent);


export default router;
