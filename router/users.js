const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../config/database');

/*Kullanıcı register aksiyonunun yazıldığı post route*/
router.post('/register', function (request, response, next) {
    let newUser = User({
        name: request.body.name,
        username: request.body.username,
        password: request.body.password,
        contact: request.body.contact,
        email: request.body.email
    });
    User.addUser(newUser, (error, user) => {
        if (error) {
            let message = "";
            if (error.errors.username) message = "Username is already taken";
            if (error.errors.email) message = "Username is already taken";
            return response.json({
                success: false,
                message
            });

        } else {
            response.json({success: true, message: 'User registered.'});
        }
    });
});
/*Kullanıcı login aksiyonunun yazıldığı post route*/
router.post('/login', function (request, response, next) {
    const username = request.body.username;
    const password = request.body.password;

    User.getUserByUsername(username, (error, user) => {
        if (error) throw error;
        if (!user) {
            return response.json({
                success: false,
                message: 'User not found',
            });
        }
        User.comparePassword(password, user.password, (error, isMatch) => {
            if (error) throw error;
            if (isMatch) {
                const token = jwt.sign({
                    type: "user", data: {
                        _id: user._id,
                        username: user.username,
                        name: user.name,
                        email: user.email,
                        contact: user.contact,
                    }
                }, config.secret, {
                    expiresIn: 604800
                });
                return response.json({
                    success: true,
                    token:"JWT "+ token
                });
            } else {
                return response.json({
                    success: false,
                    message: 'Wrong password'

                });
            }
        });
    });

});
/*/*Kullanıcı profile bilgileri getirilen aksiyonunun yazıldığı post route*/
router.get('/profile', passport.authenticate('jwt',{session:false}), (request, response) => {
    //console.log(request.user);
    return response.json(request.user);
});


module.exports = router;