var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
var passportLocalMongoose = require("passport-local-mongoose");

var adminSchema = new mongoose.Schema({
  // name: String,
  // type: String,
  // username: String,
  // password: String,
  // department: String,
  // image: String,
  // leaves: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Leave"
  //   }
  // ]
  USN:{
    type:String,
    required: true,
    unique: true
},
username:{
    // type: String,
},
password:{
    type: String,
    required: true
}
,
// department:{
//     type: String,
//     required: true
// },
// sickLeave:{
//     type: Number,
//     required: true
// },
// casualLeave:{
//     type: Number,
//     required: true
// },
// earnLeave: {
//     type: Number,
//     required: true
// }
});

adminSchema.plugin(passportLocalMongoose);
var Admin = (module.exports = mongoose.model("Admin", adminSchema));

// module.exports.createHod = function(newAdmin, callback) {
//   bcrypt.genSalt(10, function(err, salt) {
//     bcrypt.hash(newAdmin.password, salt, function(err, hash) {
//       newAdmin.password = hash;
//       newHod.save(callback);
//     });
//   });
// };

module.exports.getUserByUsername = function(username, callback) {
  var query = { username: username };
  Admin.findOne(query, callback);
};

// module.exports.getUserById = function(USN, callback) {
//   Hod.findById(USN, callback);
// };

module.exports.comparePassword = function(candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, function(err, passwordFound) {
    if (err) throw err;
    callback(null, passwordFound);
  });
};

//Admin = require("./models/admin");
// app.get("/admin", (req, res) => {
//     res.render("admin");
//   });
//   app.post(
//     "/admin",
//     (req, res) => {
//       // console.log(faculty);
//       var username = req.body.username;
//       var password=req.body.password;
//       var adminn = Admin.findOne({username:{username}},function(err){
//         if(err){
//           console.log(err);
//         }
//       });
//       if(password !== adminn.password)
//       res.redirect("register");
//       else
//       {
//         res.redirect("/");
//       }
//     }
//   );
