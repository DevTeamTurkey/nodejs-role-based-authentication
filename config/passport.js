/*PassportJS modülü için gerekli konfigrasyonlar yapılıyor.*/
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const Admin = require('../models/admin');
const config = require('../config/database');

module.exports = (userType,passport) => {
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
    opts.secretOrKey = config.secret;
    /*Gelen Token'in payload kısmının parçalandığı ve verilerin çekildiği sorgulandığı kısım*/
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {

        /*Gelen kullanıcı tipine göre veritabanında sorgu yapılıyor.*/
        if (userType==='user'){

            User.getUserById(jwt_payload.data._id, (err, user) => {
                if (err) return done(err, false);
                if (user) return done(null, user);
                return done(null, false);
            });
        }
        if (userType==='admin'){
            Admin.getAdminById(jwt_payload.data._id, (err, admin) => {
                if (err) return done(err, false);
                if (admin) return done(null, admin);
                return done(null, false);
            });
        }


    }));

};