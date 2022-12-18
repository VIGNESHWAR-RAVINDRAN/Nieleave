// app.get("/principal/login", (req, res) => {
//     res.render("principallogin");
//   });
//   let principal_data;
//   app.post(
//     "/principal/login",
//     passport.authenticate("principal", {
//       // successRedirect: "/principal/home",
//       failureRedirect: "/principal/login",
//       failureFlash: true
//     }),
//     (req, res) => {
//       console.log(req.body)
//       principal_data=req.body;
//       res.redirect("/principal/home");
//     }
//   );
//   app.get("/principal/home", ensureAuthenticated, (req, res) => {
//     console.log(principal_data)
//     Principal.findOne({username: principal_data.username}, (err,principal) => {
//       if (err) {
//         console.log(err);
//       } else {
//         // console.log(principal_data);
//         res.render("homeprincipal", {
//           principal: principal
//         });
//       }
//     });
//   });
//   app.get("/principal/:id", ensureAuthenticated, (req, res) => {
//     console.log(req.params.id);
//     Principal.findById(req.params.id).exec((err, foundPrincipal) => {
//       if (err || !foundPrincipal) {
//         req.flash("error", "Principal not found");
//         res.redirect("back");
//       } else {
//         res.render("profileprincipal", { principal: foundPrincipal });
//       }
//     });
//   });
//   app.get("/principal/:id/edit", ensureAuthenticated, (req, res) => {
//     Principal.findById(req.params.USN, (err, foundPrincipal) => {
//       res.render("editH", { principal: foundPrincipal });
//     });
//   });
//   app.put("/principal/:id", ensureAuthenticated, (req, res) => {
//     console.log(req.body.principal);
//     Principal.findByIdAndUpdate(req.params.USN, req.body.principal, (err, updatedHod) => {
//       if (err) {
//         req.flash("error", err.message);
//         res.redirect("back");
//       } else {
//         req.flash("success", "Succesfully updated");
//         res.redirect("/principal/" + req.params.USN);
//       }
//     });
//   });
//   app.get("/principal/:id/leave", (req, res) => {
//     Principal.findById(req.params.id).exec((err, principalFound) => {
//       if (err) {
//         req.flash("error", "principal not found with requested id");
//         res.redirect("back");
//       } else {
//         // console.log(principalFound);
//         console.log(principalFound);
//         Hod.find({ department: principalFound.department, })
//           .populate("leaves")
//           .exec((err, hods) => {
//             if (err) {
//               req.flash("error", "Hod not found with your department");
//               res.redirect("back");
//             } else {
//               // sacultys.forEach(function(saculty) {
//               //   if (saculty.leaves.length > 0) {
//               // saculty.leaves.forEach(function(leave) {
//               //   console.log(leave);
//               //   console.log("////////////");
//               // Leave.findById(leave, (err, leaveFound) => {
//               //   if (err) {
//               //     req.flash("error", "leave not found");
//               //     res.redirect("back");
//               //   } else {
//               //     // console.log(leaveFound.subject);
//               res.render("principalLeaveSign", {
//                 principal: principalFound,
//                 hods: hods,
//                 // leave: leaveFound,
//                 moment: moment
//               });
//               //   }
//               // });
//               // });
//               // }
//               // Leave.find({ username: saculty.username }, (err, leave) => {
//               //   console.log(leave.username);
//               // });
//               // });
//               // console.log(sacultys);
//             }
//           });
//       }
//       // console.log(req.body.principal);
//     });
//   });
  
//   app.get("/principal/:id/leave/:hod_id/info", (req, res) => {
//     Principal.findById(req.params.id).exec((err, principalFound) => {
//       if (err) {
//         req.flash("error", "principal not found with requested id");
//         res.redirect("back");
//       } else {
//         Hod.findById(req.params.hod_id)
//           .populate("leaves")
//           .exec((err, foundHod) => {
//             if (err) {
//               req.flash("error", "Hod not found with this id");
//               res.redirect("back");
//             } else {
//               res.render("moreinfohod", {
//                 Hod: foundHod,
//                 principal: principalFound,
//                 moment: moment
//               });
//             }
//           });
//       }
//     });
//   });
  
//   app.post("/principal/:id/leave/:hod_id/info", (req, res) => {
//     Principal.findById(req.params.id).exec((err, principalFound) => {
//       if (err) {
//         req.flash("error", "principal not found with requested id");
//         res.redirect("back");
//       } else {
//         Hod.findById(req.params.hod_id)
//           .populate("leaves")
//           .exec((err, foundHod) => {
//             if (err) {
//               req.flash("error", "Hod not found with this id");
//               res.redirect("back");
//             } else {
//               if (req.body.action === "Approve") {
//                 foundHod.leaves.forEach(function(leave) {
//                   if (leave.status === "pending") {
//                     leave.status = "approved";
//                     leave.approved = true;
//                     let c=leave.casualLeave;
//                     let s=leave.sickLeave;
//                     let e=leave.earnLeave;
//                     var d=leave.days;
//                     if(leave.formType==="casual")foundHod.casualLeave=foundHod.casualLeave-d;
//                     else if(leave.formType==="sick")foundHod.sickLeave=foundHod.sickLeave-d;
//                     else if(leave.formType==="earn"){
//                       foundHod.earnLeave=foundHod.earnLeave-d;
//                       console.log(foundHod.earnLeave);
//                     }
  
//                     console.log(foundHod.earnLeave);
//                     // principalFound.leaves.pop();
//                     foundHod.save();
//                     leave.save();
//                   }
//                 });
//               } else {
//                 console.log("u denied");
//                 foundHod.leaves.forEach(function(leave) {
//                   if (leave.status === "pending") {
//                     leave.status = "denied";
//                     leave.denied = true;
//                     // principalFound.leaves.pop();
//                     leave.save();
//                   }
//                 });
//               }
//               res.render("moreinfohod", {
//                 Hod: foundHod,
//                 principal: principalFound,
//                 moment: moment
//               });
//             }
//           });
//       }
//     });
//   });






app.get("/hod/:id/apply", ensureAuthenticated, (req, res) => {
    Hod.findById(req.params.id, (err, foundHod) => {
      if (err) {
        console.log(err);
        res.redirect("back");
      } else {
        res.render("leaveApply", { hod: foundHod });
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
          
          res.render("trackLeave", { hod: foundHod, moment: moment });
        }
      });
  });