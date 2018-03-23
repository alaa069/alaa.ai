'use strict';

const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    timestamps = require("mongoose-times"),
    validators = require('mongoose-validators'),
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10,
    mongoosePaginate = require('mongoose-paginate');

var enumUser = {
    values: ['user', 'admin'],
    message: 'enum validator failed for path `{PATH}` with value `{VALUE}`'
}

var token = new Schema({
    token: { type: String }
    , created_at: { type: Date, default: Date.now/*, expires: '7d'*/ }
})

var userSchema = new Schema({
    FirstName: { type: String },
    LastName: { type: String },
    FullName: { type: String },
    Username: { type: String, unique: true, required: true, lowercase: true },
    Mail: { type: String, validate: validators.isEmail(), unique: true, required: true },
    Password: { type: String, required: true },
    PasswordView: { type: String },
    TypeUser: { type: String, enum: enumUser, default: 'user' },
    validMail: { type: Boolean, default: false },
    Token: token
});

userSchema.plugin(timestamps);
userSchema.plugin(mongoosePaginate);

userSchema.pre('save', function (next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('Password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.Password, salt, function (err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.Password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.Password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

var user = mongoose.model('Users', userSchema);

module.exports = user;