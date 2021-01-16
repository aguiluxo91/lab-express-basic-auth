const mongoose = require('mongoose');
const User = require('../models/User.model');

module.exports.register = (req, res, next) => {
    res.render('users/register');
}

module.exports.doRegister = (req, res, next) => {
    function renderWithErrors(errors) {
      res.status(400).render('users/register', {
        user: req.body,
        errors: errors
      });
    }
    User.findOne({ username: req.body.username })
     .then(user => {
       if (user) {
          renderWithErrors({ username: 'User name is already registered' });   
       } else {
         return User.create(req.body)
          .then(user => res.redirect('/'))
       }
     })
      .catch(error => {
        if (error instanceof mongoose.Error.ValidationError){
          renderWithErrors(error.errors);
        } else {
          next(error);
        }
      })
}

module.exports.login = (req, res, next) => {
    res.render('users/login');
}

module.exports.doLogin = (req, res, next) => {
    User.findOne( { username: req.body.username })
        .then((user) => {
            if (user) {
                user.checkPassword(req.body.password).then((match) => {
                    if (match) {
                        req.session.currentUserId = user.id,
                        res.redirect('/');
                    } else {
                        console.log(user)
                        res.render('users/login', { username: req.body.username, errors: { password: 'Invalid password' }});
                    }
                })   
            } else {
                res.render('users/login', { username: req.body, errors: { username: 'Username not found '}})
            }
        })
        .catch(next);
}