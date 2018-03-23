const UsersDB = require('../models/user');

var User = {
    Create: function (user) {
        var newUser = new UsersDB({
            FirstName: user.FirstName,
            LastName: user.LastName,
            FullName: user.FullName,
            Username: user.Username,
            Mail: user.Mail,
            Password: user.Password,
            PasswordView: user.Password
        });
        return new Promise(function (resolve, reject) {
            newUser.save(function (err) {
                if (err) reject(err);

                resolve(true);
            });
        })
    },
    FindAll: function () {
        return new Promise(function (resolve, reject) {
            UsersDB.find({}, '_id FirstName LastName FullName Username Mail Password', function (err, docs) {
                if (err) reject(err);
                else {
                    resolve(docs)
                }
            })
        })
    },
    FindOneById: function (id) {
        return new Promise(function (resolve, reject) {
            UsersDB.findById(id, function (err, doc) {
                if (err) reject(err);
                else {
                    resolve(doc)
                }
            })
        })
    },
    FindOneByUsername: function (username) {
        return new Promise(function (resolve, reject) {
            UsersDB.findOne({ Username: username }, function (err, doc) {
                if (err) reject(err);
                else {
                    resolve(doc)
                }
            })
        })
    },
    FindOneByMail: function (mail) {
        return new Promise(function (resolve, reject) {
            UsersDB.findOne({ Mail: mail }, function (err, doc) {
                if (err) reject(err);
                else {
                    resolve(doc)
                }
            })
        })
    },
    UpdateOneById: function (id, user) {
        return new Promise(function (resolve, reject) {
            UsersDB.findById(id, function (err, doc) {
                if (err) reject(err);
                if (!doc) reject('user not exist')
                else {
                    doc = user;
                    doc.save(function (err) {
                        if (err) reject(err);

                        resolve(true)
                    });
                }
            })
        })
    },
    UpdateOneByUsername: function (username, user) {
        return new Promise(function (resolve, reject) {
            UsersDB.findOne({ Username: username }, function (err, doc) {
                if (err) reject(err);
                if (!doc) reject('user not exist')
                else {
                    user.FirstName ? doc.FirstName = user.FirstName : doc.FirstName = doc.FirstName
                    user.LastName ? doc.LastName = user.LastName : doc.LastName = doc.LastName
                    user.FirstName && doc.LastName ? doc.FullName = user.FirstName + ' ' + doc.LastName : doc.FullName = doc.FullName
                    user.Mail ? doc.Mail = user.Mail : doc.Mail = doc.Mail
                    user.Password ? doc.PasswordView = user.Password : doc.PasswordView = doc.PasswordView
                    user.Password ? doc.Password = user.Password : doc.Password = doc.PasswordView
                    doc.save(function (err) {
                        if (err) reject(err);

                        resolve(true)
                    });
                }
            })
        })
    },
    UpdateOneByMail: function (mail, user) {
        return new Promise(function (resolve, reject) {
            UsersDB.findOne({ Mail: mail }, function (err, doc) {
                if (err) reject(err);
                if (!doc) reject('user not exist')
                else {
                    doc = user;
                    doc.save(function (err) {
                        if (err) reject(err);

                        resolve(true)
                    });
                }
            })
        })
    },
    DeleteOneById: function (id) {
        return new Promise(function (resolve, reject) {
            UsersDB.findOneAndRemove({ id: id }, function (err, doc) {
                if (err) reject(err);
                if (!doc) reject('user not exist')
                else {
                    resolve(true)
                }
            })
        })
    },
    DeleteOneByUsername: function (username) {
        return new Promise(function (resolve, reject) {
            UsersDB.findOneAndRemove({ Username: username }, function (err, doc) {
                if (err) reject(err);
                if (!doc) reject('user not exist')
                else {
                    resolve(true)
                }
            })
        })
    },
    DeleteOneByMail: function (mail) {
        return new Promise(function (resolve, reject) {
            UsersDB.findOneAndRemove({ Mail: mail }, function (err, doc) {
                if (err) reject(err);
                if (!doc) reject('user not exist')
                else {
                    resolve(true)
                }
            })
        })
    },
    signIn: function (req, username, password) {
        return new Promise(function (resolve, reject) {
            req.session.reset();
            UsersDB.findOne({ Username: username }, '_id FirstName LastName FullName Username Mail Password', function (err, doc) {
                if (err) reject(err)
                else if (!doc) reject('User not exist in our System');
                else {
                    doc.comparePassword(password, function (error, isMatch) {
                        if (error) reject('Invalid username or password !');
                        else if (!isMatch) reject('Invalid username or password !');
                        else {
                            req.session.user = doc;
                            resolve(true);
                        }
                    })
                }
            })
        })
    },
    signUp: function (req, user) {
        return new Promise(function (resolve, reject) {
            req.session.reset();
            var newUser = new UsersDB({
                FirstName: user.FirstName,
                LastName: user.LastName,
                FullName: user.FullName,
                Username: user.Username,
                Mail: user.Mail,
                Password: user.Password,
                PasswordView: user.Password
            });
            newUser.save(function(err, doc){
                if (err) reject('Username or Mail exist in our system!')
                else {
                    req.session.user = {}
                    req.session.user._id = doc._id
                    req.session.user.FirstName = doc.FirstName
                    req.session.user.LastName = doc.LastName
                    req.session.user.FullName = doc.FullName
                    req.session.user.Username = doc.Username
                    req.session.user.Mail = doc.Mail
                    req.session.user.Password = doc.Password
                    resolve(true)
                }
            })
        })
    }

}

module.exports = User;