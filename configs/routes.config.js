const express = require('express');
const router = express.Router();
const commonController = require('../controllers/common.controller');
const userController = require('../controllers/user.controller');
const User = require('../models/User.model');

const isAuthenticated = (req, res, next) => {
    if (req.session.currentUserId) {
      User.findById(req.session.currentUserId)
        .then((user) => {
          if (user) {
            req.currentUser = user;
            res.locals.currentUser = user;
            next();
          } else {
            res.redirect('/login');
          }
        })
        .catch(() => {
          res.redirect('/login');
        });
    } else {
      res.redirect('/login');
    }
};

/* GET home page */
router.get('/', isAuthenticated, commonController.home);
router.get('/register', userController.register);
router.post('/register', userController.doRegister);
router.get('/login', userController.login);
router.post('/login', userController.doLogin);

module.exports = router;

