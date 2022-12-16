const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

require("../models/User");
const User = mongoose.model("user");

function isThisOk(param) {
  if (
    !param ||
    typeof param == undefined ||
    param == null ||
    param.length <= 2
  ) {
    return false;
  } else {
    return true;
  }
}

router.get("/", (req, res) => {
  res.render("index", {
    title: "Bitbucket | Git solution for teams using Jira",
  });
});

router.get("/userlist", (req, res) => {
  User.find()
    .then((users) => {
      res.render("userlist", {
        title: "userlist",
        users: users.map((users) => users.toJSON()),
      });
    })
    .catch((err) => {
      req.flash("error_msg", "Houve um erro ao listar as categorias.");
      res.redirect("index");
    });
});

router.get("/userlist/edit:id", (req, res) => {
  User.findOne({ _id: req.params.id.slice(1) })
    .lean()
    .then((users) => {
      res.render("./edituser", {
        users: users,
      });
    })
    .catch((err) => {
      req.flash("error_msg", "Esse usuário não existe");
      res.redirect("/userlist");
    });
});

router.post("/userlist/edit", (req, res) => {
  User.findOneAndUpdate(
    { _id: req.body.id },
    {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    }
  )
    .then(() => {
      req.flash("success_msg", "Usuário editado com sucesso.");
      res.redirect("/userlist");
    })
    .catch((err) => {
      req.flash("error_msg", "ERRO: " + err);
      res.redirect("/userlist");
    });
});

router.post("/userlist/delete", (req, res) => {
  User.deleteOne({ _id: req.body.id })
    .then(() => {
      req.flash("success_msg", "Usuário deletado com sucesso.");
      res.redirect("/userlist");
    })
    .catch((err) => {
      req.flash("error_msg", "Houve um erro ao deletar o usuário.");
      res.redirect("/userlist");
    });
});

router.get("/cad", (req, res) => {
  res.render("cad", { tittle: "Cadastro" });
});

router.post("/cad", (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  let errors = [];
  if (!isThisOk(username) || !isThisOk(email) || !isThisOk(password)) {
    errors.push({ text: "Dados inválidos" });
  }

  if (errors.length > 0) {
    res.render("cad", { title: "Cadastro", errors: errors });
  } else {
    const newUser = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    };

    new User(newUser)
      .save()
      .then(() => {
        req.flash("success_msg", "Usuário criada com sucesso!");
        res.redirect("userlist");
        console.log("Usuário criado!");
      })
      .catch((err) => {
        req.flash("error_msg", "Houve um erro ao salvar o usuário");
        res.redirect("cad", { title: "Cadastro" });
        console.log(`ERRO: ${err}`);
      });

    errors.push({ text: "user cadstrado" });

    res.render("cad", { title: "Cadastro", errors: errors });
  }
});

module.exports = router;
