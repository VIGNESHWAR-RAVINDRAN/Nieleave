var express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  expressvalidator = require("express-validator"),
  session = require("express-session"),
  methodOverride = require("method-override"),
  bodyparser = require("body-parser"),
  passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy,
  passportLocalMongoose = require("passport-local-mongoose"),
  flash = require("connect-flash"),
  Faculty = require("./models/faculty"),
  Principal = require("./models/principal"),
  Hod = require("./models/hod"),
  Leave = require("./models/leave"),
  Admin = require("./models/admin");

var moment = require("moment");

var url ="mongodb://localhost:27017/Leave";
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  autoIndex: false, // Don't build indexes
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4 // Use IPv4, skip trying IPv6
}
mongoose.connect(url, options,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log("connected to DB");
  })
  .catch(err => {
    console.log("Error:", err.message);
  });

app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(expressvalidator());

//passport config
app.use(
  require("express-session")({
    secret: "secret",
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
// passport.use(new LocalStrategy(Saculty.authenticate()));
// passport.use(
//   new LocalStrategy(function(username, password, done) {
//     User.findOne({ username: username }, function(err, user) {
//       if (err) {
//         return done(err);
//       }
//       if (!user) {
//         return done(null, false);
//       }
//       if (!user.verifyPassword(password)) {
//         return done(null, false);
//       }
//       return done(null, user);
//     });
//   })
// );

// passport.serializeUser(Saculty.serializeUser());
// passport.deserializeUser(Saculty.deserializeUser());
// app.use(
//   expressvalidator({
//     errorFormatter: function(param, msg, value) {
//       var namespace = param.split("."),
//         root = namespace.shift(),
//         formParam = root;

//       while (namespace.length) {
//         formParam += "[" + namespace.shift() + "]";
//       }
//       return {
//         param: formParam,
//         msg: msg,
//         value: value
//       };
//     }
//   })
// );
app.use(flash());
app.use((req, res, next) => {
  //   res.locals.currentUser = req.user;
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  res.locals.user = req.user || null;
  next();
});

function ensureAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  } else {
    req.flash("error", "You need to be logged in");
    res.redirect("/faculty/login");
  }
}
app.get("/", (req, res) => {
  res.render("home");
});

//login logic for Saculty

//login logic for Hod

// passport.serializeUser(function(hod, done) {
//   done(null, hod.id);
// });

// passport.deserializeUser(function(id, done) {

// });

//registration form
app.get("/register", (req, res) => {
  res.render("register");
});
app.get("/admin", (req, res) => {
    res.render("admin");
  });
  app.post(
    "/admin",
    (req, res) => {
      // console.log(faculty);
      var username = req.body.username;
      var password=req.body.password;
      var adminn = Admin.findOne({username:{username}},function(err){
        if(err){
          console.log(err);
        }
      });
      if(password !== adminn.password)
      res.redirect("register");
      else
      {
        res.redirect("/");
      }
    }
  );

//registration logic
app.post("/faculty/register", (req, res) => {
  var type = req.body.type;
  if (type == "faculty") {
    var name = req.body.name;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;
    var department = req.body.department;
    var image = req.body.image;
    var email=req.body.email;
    var sickLeave=req.body.sickLeave;
    var casualLeave=req.body.casualLeave;
    var earnLeave=req.body.earnLeave;
    var USN=req.body.USN;
  
    //validation
    req.checkBody("name", "name is required").notEmpty();
    req.checkBody("username", "Username is required").notEmpty();
    
    req.checkBody("department", "department is required").notEmpty();
    req.checkBody("password", "Password is required").notEmpty();
    req.checkBody("password2", "Password dont match").equals(req.body.password);
    req.checkBody("USN", "USN is required").notEmpty();    
    req.checkBody("email", "email is required").notEmpty();    
    req.checkBody("sickLeave", "sickLeave is required").notEmpty();    
    req.checkBody("casualLeave", "casualLeave is required").notEmpty();    
    req.checkBody("earnLeave", "earnLeave is required").notEmpty();    
    

    var errors = req.validationErrors();
    if (errors) {
      // req.session.errors = errors;
      // req.session.success = false;
      console.log("errors: " + errors);
      res.render("register", {
        errors: errors
      });
    } else {
      var newFaculty = new Faculty({
        name: name,
        username: username,
        password: password,
        department: department,
        email: email,
        sickLeave:sickLeave,
        earnLeave:earnLeave,
        casualLeave:casualLeave,
        type: type,
         USN:USN,
        image: image
      });
      Faculty.createFaculty(newFaculty, (err, faculty) => {
        if (err) throw err;
        console.log(faculty);
      });
      req.flash("success", "you are registered successfully,now you can login");

      res.redirect("/faculty/login");
    }
  } else if (type == "hod") {
    var name = req.body.name;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;
    var department = req.body.department;
    var image = req.body.image;
    var email=req.body.email;
    var sickLeave=req.body.sickLeave;
    var casualLeave=req.body.casualLeave;
    var earnLeave=req.body.earnLeave;
    var USN=req.body.USN;

    req.checkBody("name", "Name is required").notEmpty();
    req.checkBody("username", "Username is required").notEmpty();
    req.checkBody("password", "password is required").notEmpty();
    req.checkBody("department", "department is required").notEmpty();
    req.checkBody("password2", "Password dont match").equals(req.body.password);

    var errors = req.validationErrors();
    if (errors) {
      res.render("register", {
        errors: errors
      });
    } else {
      var newHod = new Hod({
        name: name,
        username: username,
        password: password,
        department: department,
        email: email,
        sickLeave:sickLeave,
        earnLeave:earnLeave,
        casualLeave:casualLeave,
        type: type,
         USN:USN,
        image: image
      });
      Hod.createHod(newHod, (err, hod) => {
        if (err) throw err;
        console.log(hod);
      });
      req.flash("success", "you are registered successfully,now you can login");

      res.redirect("/hod/login");
    }
  } else if (type == "principal") {
    var USN=req.body.USN;
    var name = req.body.name;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;
    var image = req.body.image;
    req.checkBody("USN", "USN is required").notEmpty();
    req.checkBody("name", "Name is required").notEmpty();
    req.checkBody("username", "Username is required").notEmpty();
    req.checkBody("password", "password is required").notEmpty();
    req.checkBody("password2", "Password dont match").equals(req.body.password);
    var errors = req.validationErrors();
    if (errors) {
      res.render("register", {
        errors: errors
      });
    } else {
      var newprincipal = new Principal({
        USN:USN,
        name: name,
        username: username,
        password: password,
        type: type,
        image: image
      });
      Principal.createprincipal(newprincipal, (err, principal) => {
        if (err) throw err;
        console.log(principal);
      });
      req.flash("success", "you are registered successfully,now you can login");

      res.redirect("/principal/login");
    }
  }
});

//stratergies
passport.use(
  "faculty",
  new LocalStrategy((username, password, done) => {
    Faculty.getUserByUsername(username, (err, faculty) => {
      if (err) throw err;
      if (!faculty) {
        return done(null, false, { message: "Unknown User" });
      }
      Faculty.comparePassword(password, faculty.password,(err, passwordFound) => {
          if (err) throw err;
          if (passwordFound) {
            return done(null, faculty);
          } else {
            return done(null, false, { message: "Invalid Password" });
          }
        }
      );
    });
  })
);

passport.use(
  "hod",
  new LocalStrategy((username, password, done) => {
    Hod.getUserByUsername(username, (err, hod) => {
      if (err) throw err;
      if (!hod) {
        return done(null, false, { message: "Unknown User" });
      }
      Hod.comparePassword(password, hod.password, (err, passwordFound) => {
        if (err) throw err;
        if (passwordFound) {
          return done(null, hod);
        } else {
          return done(null, false, { message: "Invalid Password" });
        }
      });
    });
  })
);

passport.use(
  "principal",
  new LocalStrategy((username, password, done) => {
    Principal.getUserByUsername(username, (err, principal) => {
      if (err) throw err;
      if (!principal) {
        return done(null, false, { message: "Unknown User" });
      }
      Principal.comparePassword(
        password,
        principal.password,
        (err, passwordFound) => {
          if (err) throw err;
          if (passwordFound) {
            return done(null, principal);
          } else {
            return done(null, false, { message: "Invalid Password" });
          }
        }
      );
    });
  })
);

//srialize

passport.serializeUser(function(user, done) {
  // console.log(user.id);
  done(null, { id: user.USN, type: user.type });
});

//deserialize

passport.deserializeUser(function(obj, done) {
  switch (obj.type) {
    case "faculty":
      Faculty.getUserById(obj.USN, function(err, faculty) {
        done(err, faculty);
      });
      break;
    case "hod":
      Hod.getUserById(obj.USN, function(err, hod) {
        done(err, hod);
      });
      break;
    case "principal":
      Principal.getUserById(obj.USN, function(err, principal) {
        done(err, principal);
      });
      break;
    default:
      done(new Error("no entity type:", obj.type), null);
      break;
  }
});

app.get("/faculty/login", (req, res) => {
  res.render("login");
});

// app.post(
//   "/faculty/login",
//   passport.authenticate("faculty", {
//     successRedirect: "/faculty/home",
//     failureRedirect: "/faculty/login",
//     failureFlash: true
//   }),
//   (req, res) => {
//     res.redirect("/faculty/home");
//   }
// );

// app.get("/faculty/home", ensureAuthenticated, (req, res) => {
//   var faculty = req.body;
//   console.log(req.body);
//   Faculty.findOne({ username: req.body.username })
//     .populate("leaves")
//     .exec((err, faculty) => {
//       if (err || !faculty) {
//         req.flash("error", "faculty not found");
//         res.redirect("back");
//         console.log("err");
//       } else {
//         res.render("homefac", {
//           faculty: faculty,
//           moment: moment
//         });
//       }
//     });
// });


let faculty_data;
app.post(
  "/faculty/login",
  passport.authenticate("faculty", {
    // successRedirect: "/hod/home",
    failureRedirect: "/faculty/login",
    failureFlash: true
  }),
  (req, res) => {
    faculty_data=req.body
    res.redirect("/faculty/home");
  }
);
app.get("/faculty/home", ensureAuthenticated, (req, res) => {
  console.log(faculty_data)
  Faculty.findOne({username: faculty_data.username}, (err,faculty) => {
    if (err) {
      console.log(err);
    } else {
      console.log(faculty);
      res.render("homefac", {
        faculty: faculty
      });
    }
  });
});
app.get("/faculty/:id", ensureAuthenticated, (req, res) => {
  console.log(req.params.id);
  Faculty.findById(req.params.id)
    .populate("leaves")
    .exec((err, foundFaculty) => {
      if (err || !foundFaculty) {
        req.flash("error", "Faculty not found");
        res.redirect("back");
      } else {
        res.render("profilefac", { faculty: foundFaculty });
      }
    });
});
app.get("/faculty/:id/edit", ensureAuthenticated, (req, res) => {
  Faculty.findById(req.params.id, (err, foundFaculty) => {
    res.render("editS", { faculty: foundFaculty });
  });
});
app.put("/faculty/:id", ensureAuthenticated, (req, res) => {
  console.log(req.body.faculty);
  Faculty.findByIdAndUpdate(
    req.params.USN,
    req.body.faculty,
    (err, updatedFaculty) => {
      if (err) {
        req.flash("error", err.message);
        res.redirect("back");
      } else {
        req.flash("success", "Succesfully updated");
        res.redirect("/faculty/" + req.params.USN);
      }
    }
  );
});

app.get("/faculty/:id/apply", ensureAuthenticated, (req, res) => {
  Faculty.findById(req.params.id, (err, foundFac) => {
    if (err) {
      console.log(err);
      res.redirect("back");
    } else {
      res.render("leaveApply", { faculty: foundFac });
    }
  });
});

app.post("/faculty/:id/apply", (req, res) => {
  Faculty.findById(req.params.id)
    .populate("leaves")
    .exec((err, faculty) => {
      if (err) {
        res.redirect("/faculty/home");
      } else {
        date = new Date(req.body.leave.from);
        todate = new Date(req.body.leave.to);
        year = date.getFullYear();
        month = date.getMonth() + 1;
        dt = date.getDate();
        todt = todate.getDate();
         
        if (dt < 10) {
          dt = "0" + dt;
        }
        if (month < 10) {
          month = "0" + month;
        }
        console.log(todt - dt);
        req.body.leave.days = todt - dt;
        console.log(year + "-" + month + "-" + dt);
        // req.body.leave.to = req.body.leave.to.substring(0, 10);
        console.log(req.body.leave);
        // var from = new Date(req.body.leave.from);
        // from.toISOString().substring(0, 10);
        // console.log("from date:", strDate);
        Leave.create(req.body.leave, (err, newLeave) => {
          if (err) {
            req.flash("error", "Something went wrong");
            res.redirect("back");
            console.log(err);
          } else {
            newLeave.fac.id = req.body._id;
            newLeave.fac.username = faculty.username;
            newLeave.formType=req.body.type;
            console.log("leave is applied by--" + faculty.username);

            // console.log(newLeave.from);
            newLeave.save();

            faculty.leaves.push(newLeave);

            faculty.save();
            req.flash("success", "Successfully applied for leave");
            res.render("homefac", { faculty: faculty, moment: moment });
          }
        });
      }
    });
});
app.get("/faculty/:id/track", (req, res) => {
  Faculty.findById(req.params.id)
    .populate("leaves")
    .exec((err, foundFac) => {
      if (err) {
        req.flash("error", "No faculty with requested id");
        res.redirect("back");
      } else {
        
        res.render("trackLeave", { faculty: foundFac, moment: moment });
      }
    });
});
app.get("/hod/login", (req, res) => {
  res.render("hodlogin");
});
let hod_data;
app.post(
  "/hod/login",
  passport.authenticate("hod", {
    // successRedirect: "/hod/home",
    failureRedirect: "/hod/login",
    failureFlash: true
  }),
  (req, res) => {
    console.log(req.body)
    hod_data=req.body;
    res.redirect("/hod/home");
  }
);
app.get("/hod/home", ensureAuthenticated, (req, res) => {
  console.log(hod_data)
  Hod.findOne({username: hod_data.username}, (err,hod) => {
    if (err) {
      console.log(err);
    } else {
      // console.log(hod_data);
      res.render("homehod", {
        hod: hod
      });
    }
  });
});
app.get("/hod/:id", ensureAuthenticated, (req, res) => {
  console.log(req.params.id);
  Hod.findById(req.params.id).exec((err, foundHod) => {
    if (err || !foundHod) {
      req.flash("error", "Hod not found");
      res.redirect("back");
    } else {
      res.render("profilehod", { hod: foundHod });
    }
  });
});
app.get("/hod/:id/edit", ensureAuthenticated, (req, res) => {
  Hod.findById(req.params.USN, (err, foundHod) => {
    res.render("editH", { hod: foundHod });
  });
});
app.put("/hod/:id", ensureAuthenticated, (req, res) => {
  console.log(req.body.hod);
  Hod.findByIdAndUpdate(req.params.USN, req.body.hod, (err, updatedHod) => {
    if (err) {
      req.flash("error", err.message);
      res.redirect("back");
    } else {
      req.flash("success", "Succesfully updated");
      res.redirect("/hod/" + req.params.USN);
    }
  });
});
app.get("/hod/:id/leave", (req, res) => {
  Hod.findById(req.params.id).exec((err, hodFound) => {
    if (err) {
      req.flash("error", "hod not found with requested id");
      res.redirect("back");
    } else {
      // console.log(hodFound);
      console.log(hodFound);
      Faculty.find({ department: hodFound.department, })
        .populate("leaves")
        .exec((err, faculties) => {
          if (err) {
            req.flash("error", "faculty not found with your department");
            res.redirect("back");
          } else {
            // sacultys.forEach(function(saculty) {
            //   if (saculty.leaves.length > 0) {
            // saculty.leaves.forEach(function(leave) {
            //   console.log(leave);
            //   console.log("////////////");
            // Leave.findById(leave, (err, leaveFound) => {
            //   if (err) {
            //     req.flash("error", "leave not found");
            //     res.redirect("back");
            //   } else {
            //     // console.log(leaveFound.subject);
            res.render("hodLeaveSign", {
              hod: hodFound,
              faculties: faculties,
              // leave: leaveFound,
              moment: moment
            });
            //   }
            // });
            // });
            // }
            // Leave.find({ username: saculty.username }, (err, leave) => {
            //   console.log(leave.username);
            // });
            // });
            // console.log(sacultys);
          }
        });
    }
    // console.log(req.body.hod);
  });
});

app.get("/hod/:id/leave/:fac_id/info", (req, res) => {
  Hod.findById(req.params.id).exec((err, hodFound) => {
    if (err) {
      req.flash("error", "hod not found with requested id");
      res.redirect("back");
    } else {
      Faculty.findById(req.params.fac_id)
        .populate("leaves")
        .exec((err, foundFaculty) => {
          if (err) {
            req.flash("error", "faculty not found with this id");
            res.redirect("back");
          } else {
            res.render("moreinfofac", {
              faculty: foundFaculty,
              hod: hodFound,
              moment: moment
            });
          }
        });
    }
  });
});

app.post("/hod/:id/leave/:fac_id/info", (req, res) => {
  Hod.findById(req.params.id).exec((err, hodFound) => {
    if (err) {
      req.flash("error", "hod not found with requested id");
      res.redirect("back");
    } else {
      Faculty.findById(req.params.fac_id)
        .populate("leaves")
        .exec((err, foundFaculty) => {
          if (err) {
            req.flash("error", "faculty not found with this id");
            res.redirect("back");
          } else {
            if (req.body.action === "Approve") {
              foundFaculty.leaves.forEach(function(leave) {
                if (leave.status === "pending") {
                  leave.status = "approved";
                  leave.approved = true;
                  let c=leave.casualLeave;
                  let s=leave.sickLeave;
                  let e=leave.earnLeave;
                  var d=leave.days;
                  if(leave.formType==="casual")foundFaculty.casualLeave=foundFaculty.casualLeave-d;
                  else if(leave.formType==="sick")foundFaculty.sickLeave=foundFaculty.sickLeave-d;
                  else if(leave.formType==="earn"){
                    foundFaculty.earnLeave=foundFaculty.earnLeave-d;
                    console.log(foundFaculty.earnLeave);
                  }

                  console.log(foundFaculty.earnLeave);
                  // hodFound.leaves.pop();
                  foundFaculty.save();
                  leave.save();
                }
              });
            } else {
              console.log("u denied");
              foundFaculty.leaves.forEach(function(leave) {
                if (leave.status === "pending") {
                  leave.status = "denied";
                  leave.denied = true;
                  // hodFound.leaves.pop();
                  leave.save();
                }
              });
            }
            res.render("moreinfofac", {
              faculty: foundFaculty,
              hod: hodFound,
              moment: moment
            });
          }
        });
    }
  });
});


app.get("/hod/:id/apply", ensureAuthenticated, (req, res) => {
  Hod.findById(req.params.id, (err, foundHod) => {
    if (err) {
      console.log(err);
      res.redirect("back");
    } else {
      res.render("leaveHod", { hod: foundHod });
    }
  });
});

app.post("/hod/:id/apply", (req, res) => {
  Hod.findById(req.params.id)
    .populate("leaves")
    .exec((err, hod) => {
      if (err) {
        res.redirect("/hod/home");
      } else {
        date = new Date(req.body.leave.from);
        todate = new Date(req.body.leave.to);
        year = date.getFullYear();
        month = date.getMonth() + 1;
        dt = date.getDate();
        todt = todate.getDate();
         
        if (dt < 10) {
          dt = "0" + dt;
        }
        if (month < 10) {
          month = "0" + month;
        }
        console.log(todt - dt);
        req.body.leave.days = todt - dt;
        console.log(year + "-" + month + "-" + dt);
        // req.body.leave.to = req.body.leave.to.substring(0, 10);
        console.log(req.body.leave);
        // var from = new Date(req.body.leave.from);
        // from.toISOString().substring(0, 10);
        // console.log("from date:", strDate);
        Leave.create(req.body.leave, (err, newLeave) => {
          if (err) {
            req.flash("error", "Something went wrong");
            res.redirect("back");
            console.log(err);
          } else {
            newLeave.hod.id = req.body._id;
            newLeave.hod.username = hod.username;
            newLeave.formType=req.body.type;
            console.log("leave is applied by--" + hod.username);

            // console.log(newLeave.from);
            newLeave.save();

            hod.leaves.push(newLeave);

            hod.save();
            req.flash("success", "Successfully applied for leave");
            res.render("homehod", { hod: hod, moment: moment });
          }
        });
      }
    });
});
app.get("/hod/:id/track", (req, res) => {
  Hod.findById(req.params.id)
    .populate("leaves")
    .exec((err, foundHod) => {
      if (err) {
        req.flash("error", "No hod with requested id");
        res.redirect("back");
      } else {
        
        res.render("trackHod", { hod: foundHod, moment: moment });
      }
    });
});


// app.get("/principal/login", (req, res) => {
//   res.render("principallogin");
// });

// app.post(
//   "/principal/login",
//   passport.authenticate("principal", {
//     // successRedirect: "/principal/home",
//     failureRedirect: "/principal/login",
//     failureFlash: true
//   }),
//   (req, res) => {
//     res.redirect("/principal/home");
//   }
// );
// let prin_data;
// app.get("/principal/home", ensureAuthenticated, (req, res) => {
//   Principal.findOne({username:"bc"}, (err, principal) => {
//     prin_data=principal;
//     if (err) {
//       console.log("err");
//     } else {
//       res.render("homeprincipal", {
       
//         principal: principal
//       });
//     }
//   });
// });

// app.get("/principal/:id", ensureAuthenticated, (req, res) => {
//   console.log(req.params);
//   Principal.findOne({USN:prin_data.USN},(err, foundprincipal)=>{
//     if (err || !foundprincipal) {
//       if(err)console.log(err);
//       req.flash("error", "principal not found");
//       res.redirect("back");
//     } else {
//       res.render("profileprincipal", { principal: foundprincipal });
//     }
//   });
// });
// app.get("/principal/:id/edit", ensureAuthenticated, (req, res) => {
//   Principal.findById(req.params.id, (err, foundprincipal) => {
//     res.render("editW", { principal: foundprincipal });
//   });
// });

// app.put("/principal/:id", ensureAuthenticated, (req, res) => {
//   console.log(req.body.principal);
//   Principal.findByIdAndUpdate(
//     req.params.id,
//     req.body.principal,
//     (err, updatedprincipal) => {
//       if (err) {
//         req.flash("error", err.message);
//         res.redirect("back");
//       } else {
//         req.flash("success", "Succesfully updated");
//         res.redirect("/principal/" + req.params.id);
//       }
//     }
//   );
// });

// app.get("/principal/:id/leave", (req, res) => {
//   Principal.findById(req.params.id).exec((err, principalFound) => {
//     if (err) {
//       req.flash("error", "hod not found with requested id");
//       res.redirect("back");
//     } else {
//       // console.log(hodFound);
//       Faculty.find({ hostel: principalFound.hostel })
//         .populate("leaves")
//         .exec((err, faculties) => {
//           if (err) {
//             req.flash("error", "faculty not found with your department");
//             res.redirect("back");
//           } else {
//             res.render("principalLeaveSign", {
//               principal: principalFound,
//               faculties: faculties,

//               moment: moment
//             });
//           }
//         });
//     }
//   });
// });
// app.get("/principal/:id/leave/:fac_id/info", (req, res) => {
//   Principal.findById(req.params.id).exec((err, principalFound) => {
//     if (err) {
//       req.flash("error", "principal not found with requested id");
//       res.redirect("back");
//     } else {
//       Faculty.findById(req.params.fac_id)
//         .populate("leaves")
//         .exec((err, foundFaculty) => {
//           if (err) {
//             req.flash("error", "faculty not found with this id");
//             res.redirect("back");
//           } else {
//             res.render("principalmoreinfofac", {
//               faculty: foundFaculty,
//               principal: principalFound,
//               moment: moment
//             });
//           }
//         });
//     }
//   });
// });

// app.post("/principal/:id/leave/:fac_id/info", (req, res) => {
//   Principal.findById(req.params.id).exec((err, principalFound) => {
//     if (err) {
//       req.flash("error", "principal not found with requested id");
//       res.redirect("back");
//     } else {
//       Faculty.findById(req.params.fac_id)
//         .populate("leaves")
//         .exec((err, foundFaculty) => {
//           if (err) {
//             req.flash("error", "faculty not found with this id");
//             res.redirect("back");
//           } else {
//             if (req.body.action === "Approve") {
//               foundFaculty.leaves.forEach(function(leave) {
//                 if (leave.principalstatus === "pending") {
//                   leave.principalstatus = "approved";

//                   leave.save();
//                 }
//               });
//             } else {
//               console.log("u denied");
//               foundFaculty.leaves.forEach(function(leave) {
//                 if (leave.principalstatus === "pending") {
//                   leave.principalstatus = "denied";

//                   leave.save();
//                 }
//               });
//             }
//             res.render("principalmoreinfofac", {
//               faculty: foundFaculty,
//               principal: principalFound,
//               moment: moment
//             });
//           }
//         });
//     }
//   });
// });



app.get("/principal/login", (req, res) => {
  res.render("principallogin");
});
let principal_data;
app.post(
  "/principal/login",
  passport.authenticate("principal", {
    // successRedirect: "/principal/home",
    failureRedirect: "/principal/login",
    failureFlash: true
  }),
  (req, res) => {
    console.log(req.body)
    principal_data=req.body;
    res.redirect("/principal/home");
  }
);
app.get("/principal/home", ensureAuthenticated, (req, res) => {
  console.log(principal_data)
  Principal.findOne({username: principal_data.username}, (err,principal) => {
    if (err) {
      console.log(err);
    } else {
      // console.log(principal_data);
      res.render("homeprincipal", {
        principal: principal
      });
    }
  });
});
app.get("/principal/:id", ensureAuthenticated, (req, res) => {
  console.log(req.params.id);
  Principal.findById(req.params.id).exec((err, foundPrincipal) => {
    if (err || !foundPrincipal) {
      req.flash("error", "Principal not found");
      res.redirect("back");
    } else {
      res.render("profileprincipal", { principal: foundPrincipal });
    }
  });
});
app.get("/principal/:id/edit", ensureAuthenticated, (req, res) => {
  Principal.findById(req.params.USN, (err, foundPrincipal) => {
    res.render("editH", { principal: foundPrincipal });
  });
});
app.put("/principal/:id", ensureAuthenticated, (req, res) => {
  console.log(req.body.principal);
  Principal.findByIdAndUpdate(req.params.USN, req.body.principal, (err, updatedHod) => {
    if (err) {
      req.flash("error", err.message);
      res.redirect("back");
    } else {
      req.flash("success", "Succesfully updated");
      res.redirect("/principal/" + req.params.USN);
    }
  });
});
app.get("/principal/:id/leave", (req, res) => {
  Principal.findById(req.params.id).exec((err, principalFound) => {
    if (err) {
      req.flash("error", "principal not found with requested id");
      res.redirect("back");
    } else {
      // console.log(principalFound);
      console.log(principalFound);
      Hod.find({ })
        .populate("leaves")
        .exec((err, hods) => {
          if (err) {
            req.flash("error", "Hod not found with your department");
            res.redirect("back");
          } else {
            // sacultys.forEach(function(saculty) {
            //   if (saculty.leaves.length > 0) {
            // saculty.leaves.forEach(function(leave) {
            //   console.log(leave);
            //   console.log("////////////");
            // Leave.findById(leave, (err, leaveFound) => {
            //   if (err) {
            //     req.flash("error", "leave not found");
            //     res.redirect("back");
            //   } else {
            //     // console.log(leaveFound.subject);
            res.render("principalLeaveSign", {
              principal: principalFound,
              hods: hods,
              // leave: leaveFound,
              moment: moment
            });
            //   }
            // });
            // });
            // }
            // Leave.find({ username: saculty.username }, (err, leave) => {
            //   console.log(leave.username);
            // });
            // });
            // console.log(sacultys);
          }
        });
    }
    // console.log(req.body.principal);
  });
});

app.get("/principal/:id/leave/:hod_id/info", (req, res) => {
  Principal.findById(req.params.id).exec((err, principalFound) => {
    if (err) {
      req.flash("error", "principal not found with requested id");
      res.redirect("back");
    } else {
      Hod.findById(req.params.hod_id)
        .populate("leaves")
        .exec((err, foundHod) => {
          if (err) {
            req.flash("error", "Hod not found with this id");
            res.redirect("back");
          } else {
            console.log(foundHod);
            res.render("moreinfohod", {
              hod: foundHod,
              principal: principalFound,
              moment: moment
            });
          }
        });
    }
  });
});

app.post("/principal/:id/leave/:hod_id/info", (req, res) => {
  Principal.findById(req.params.id).exec((err, principalFound) => {
    if (err) {
      req.flash("error", "principal not found with requested id");
      res.redirect("back");
    } else {
      Hod.findById(req.params.hod_id)
        .populate("leaves")
        .exec((err, foundHod) => {
          if (err) {
            req.flash("error", "Hod not found with this id");
            res.redirect("back");
          } else {
            if (req.body.action === "Approve") {
              foundHod.leaves.forEach(function(leave) {
                if (leave.status === "pending") {
                  leave.status = "approved";
                  leave.approved = true;
                  let c=leave.casualLeave;
                  let s=leave.sickLeave;
                  let e=leave.earnLeave;
                  var d=leave.days;
                  if(leave.formType==="casual")foundHod.casualLeave=foundHod.casualLeave-d;
                  else if(leave.formType==="sick")foundHod.sickLeave=foundHod.sickLeave-d;
                  else if(leave.formType==="earn"){
                    foundHod.earnLeave=foundHod.earnLeave-d;
                    console.log(foundHod.earnLeave);
                  }

                  console.log(foundHod.earnLeave);
                  // principalFound.leaves.pop();
                  foundHod.save();
                  leave.save();
                }
              });
            } else {
              console.log("u denied");
              foundHod.leaves.forEach(function(leave) {
                if (leave.status === "pending") {
                  leave.status = "denied";
                  leave.denied = true;
                  // principalFound.leaves.pop();
                  leave.save();
                }
              });
            }
            res.render("moreinfohod", {
              hod: foundHod,
              principal: principalFound,
              moment: moment
            });
          }
        });
    }
  });
});




//logout for saculty

app.get("/logout", (req, res) => {
  req.logout();
  // req.flash("success", "you are logged out");
  res.redirect("/");
});

const port =  3000;
app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});