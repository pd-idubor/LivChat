import express from 'express';
//import AppController from '../controllers/AppController';
import verifySign from '../utils/verify.js';
import verifyToken from '../utils/auth.js';
import UsersController from '../controllers/usersController.js';
//import AuthController from '../controllers/AuthController';
//import FilesController from '../controllers/FilesController';

const router = express.Router();

router.get('/', function(req, res) {
  res.render('pages/land_page');
});

/*router.get('/user', [verifyToken], function(req, res) {
  res.render('pages/dashboard');
});
*/

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
router.post('/api/auth/signup', [UsersController.checkCred, verifySign], UsersController.signUp);
/*], function(req, res){
  res.json('Signed up!');
});
*/
router.post('/api/auth/signin', [UsersController.checkCred, UsersController.signIn], function(req, res){
  UsersController.signIn;
  //res.json('Signed in');
  res.render('pages/profile');
});

router.post('/api/auth/signout', function(req, res){
  UsersController.signOut;
  res.json('Signed out');
});

//router.get('/status', AppController.getstatus);
// router.get('/stats', AppController.getstats);

export default router;
