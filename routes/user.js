const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require("passport");

require("../models/User");
const User = mongoose.model("user");

function isThisOk(param) {
  if (
    !param ||
    typeof param == undefined ||
    param == null ||
    param.length < 3
  ) {
    return false;
  } else {
    return true;
  }
}

router.get("/register", (req, res) => {
  res.render("users/register", { title: "Registrar" });
});

router.post("/register", (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const password2 = req.body.confirmpassword;
  let errors = [];

  if (!isThisOk(username) || !isThisOk(email) || !isThisOk(password)) {
    errors.push({ text: "Dados inválidos" });
  }

  if (password != password2) {
    errors.push({ text: "As senhas são diferentes" });
  }

  if (errors.length > 0) {
    res.render("users/register", { title: "Registrar", errors: errors });
  } else {
    User.findOne({ email: email }).then((user) => {
      if (user) {
        req.flash("error_msg", "Usuário e/ou email indisponiveis");
        res.redirect("/user/register");
      } else {
        const newUser = {
          username: username,
          email: email,
          password: password,
        };

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(password, salt, (err, hash) => {
            if (err) {
              req.flash("error_msg", "Houve um erro: " + err);
              res.redirect("/");
            }

            newUser.password = hash;

            new User(newUser)
              .save()
              .then(() => {
                req.flash("success_msg", "Usuário criada com sucesso!");
                res.redirect("/");
              })
              .catch((err) => {
                req.flash(
                  "error_msg",
                  "Houve um erro ao salvar o usuário: " + err
                );
                res.redirect("/user/register");
              });
          });
        });
      }
    });
    /**/
    console.log("passou");
    res.render("users/register", { title: "Cadastro", errors: errors });
  }
});

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post("/login", (req, res, next) => {
  console.log("foi");
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/user/login",
    failureFlash: true,
  })(req, res, next);
});

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    req.flash("success_msg", "Deslogado com sucesso.");
    res.redirect("/");
  });
});

module.exports = router;
