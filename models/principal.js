// var mongoose = require("mongoose");
// var bcrypt = require("bcryptjs");
// var passportLocalMongoose = require("passport-local-mongoose");

// var principalSchema = new mongoose.Schema({
//   USN:{
//     type:String,
//     required: true,
//     unique: true
// },
//   name: String,
//   type: String,
//   username: String,
//   password: String,
//   image: String
// });

// principalSchema.plugin(passportLocalMongoose);
// var Principal = (module.exports = mongoose.model("Principal", principalSchema));

// module.exports.createprincipal = function(newprincipal, callback) {
//   bcrypt.genSalt(10, function(err, salt) {
//     bcrypt.hash(newprincipal.password, salt, function(err, hash) {
//       newprincipal.password = hash;
//       newprincipal.save(callback);
//     });
//   });
// };

// module.exports.getUserByUsername = function(username, callback) {
//   var query = { username: username };
//   Principal.findOne(query, callback);
// };

// module.exports.getUserById = function(USN, callback) {
//   Principal.findOne(USN, callback);
// };

// module.exports.comparePassword = function(candidatePassword, hash, callback) {
//   bcrypt.compare(candidatePassword, hash, function(err, passwordFound) {
//     if (err) throw err;
//     callback(null, passwordFound);
//   });
// };
var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
var passportLocalMongoose = require("passport-local-mongoose");

var principalSchema = new mongoose.Schema({
  name: String,
  // type: String,
  // username: String,
  // password: String,
  // department: String,
  // image: String,

  USN:{
    type:String,
    required: true,
    unique: true
},
username:{
    type: String,
    required: true
},
password:{
    type: String,
    required: true
},
type: String

});

principalSchema.plugin(passportLocalMongoose);
var Principal = (module.exports = mongoose.model("Principal", principalSchema));

module.exports.createprincipal = function(newPrincipal, callback) {
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newPrincipal.password, salt, function(err, hash) {
      newPrincipal.password = hash;
      newPrincipal.save(callback);
    });
  });
};

module.exports.getUserByUsername = function(username, callback) {
  var query = { username: username };
  Principal.findOne(query, callback);
};

module.exports.getUserById = function(USN, callback) {
  Principal.findById(USN, callback);
};

module.exports.comparePassword = function(candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, function(err, passwordFound) {
    if (err) throw err;
    callback(null, passwordFound);
  });
};

