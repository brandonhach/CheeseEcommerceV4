const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');
const { isGuest, isLoggedIn } = require('../middleware/auth');

// GET /user/new: send HTML form for user signup
router.get('/new', isGuest, controller.new);

// POST /user/new: handle user signup
router.post('/new', isGuest, controller.create);

//GET /users/login: send html for logging in
router.get('/login', isGuest, controller.getUserLogin);

//POST /users/login: authenticate user's login
router.post('/login', isGuest, controller.login);

//GET /users/profile: send user's profile page
router.get('/profile', isLoggedIn, controller.profile);

//POST /users/logout: logout a user
router.get('/logout', isLoggedIn, controller.logout);

module.exports = router;
