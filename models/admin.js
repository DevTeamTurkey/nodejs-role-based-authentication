const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const uniqueValidator = require('mongoose-unique-validator');

const adminSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    contact: {
        type: String,
        required: true,
        unique: true,
    },
    job_profile: {
        type: String,
        required: true,
    },
});
adminSchema.plugin(uniqueValidator);

const Admin = module.exports = mongoose.model('Admin', adminSchema);

/*Veritabanından id ye göre adminin çekildiği metot*/
module.exports.getAdminById = function (id, callback) {
    Admin.findById(id, callback);
};
/*Veritabanından kullanıcı adına göre adminin çekildiği metot*/
module.exports.getAdminByUsername = function (username, callback) {
    const query = {username: username};
    Admin.findOne(query, callback);
};
/*veritabanına şifreyi hashleyerek admin kaydının gerçekleştiği metot*/
module.exports.addAdmin = function (newAdmin, callback) {
    bcrypt.genSalt(10, (error, salt) => {
        bcrypt.hash(newAdmin.password, salt, (error, hash) => {
            if (error) return error;
            newAdmin.password = hash;
            newAdmin.save(callback);
        });
    });
};
/*Veritabanında şifre kıyaslama yapan metot*/
module.exports.comparePassword=function (password,hash,callback) {
    bcrypt.compare(password,hash,(error,isMatch)=>{
        if(error) throw error;
        callback(null,isMatch);
    });
};