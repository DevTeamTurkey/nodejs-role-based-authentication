const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');
const config = require('../config/database');

/*Admin register aksiyonunun yazıldığı post route*/
router.post('/register', function (request, response, next) {
    console.log(request.body);
    let newUser = Admin({
        name: request.body.name,
        username: request.body.username,
        password: request.body.password,
        contact: request.body.contact,
        email: request.body.email,
        job_profile: request.body.job_profile
    });
    Admin.addAdmin(newUser, (error, user) => {
        if (error) {
            let message = "";
            if (error.errors.username) message = "Username is already taken";
            if (error.errors.email) message = "Username is already taken";
            return response.json({
                success: false,
                message
            });

        } else {
            response.json({success: true, message: 'Admin registered.'});
        }
    });
});
/*Admin login aksiyonunun yazıldığı post route*/
router.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    Admin.getAdminByUsername(username, (err, admin) => {
        if (err) throw err;
        if (!admin) {
            return res.json({
                success: false,
                message: "Admin not found."
            });
        }

        Admin.comparePassword(password, admin.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                const token = jwt.sign({
                    type: "admin",
                    data: {
                        _id: admin._id,
                        username: admin.username,
                        name: admin.name,
                        email: admin.email,
                        contact: admin.contact,
                        job_profile: admin.job_profile
                    }
                }, config.secret, {
                    expiresIn: 604800 // for 1 week time in milliseconds
                });
                return res.json({
                    success: true,
                    token: "JWT " + token
                });
            } else {
                return res.json({
                    success: true,
                    message: "Wrong Password."
                });
            }
        });
    });
});
/*Admin profil bilgileri getirme aksiyonunun yazıldığı post route*/
router.get('/profile', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    // console.log(req.user);
    return res.json(
        req.user
    );
});

module.exports = router;