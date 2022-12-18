const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

require("../models/User");
const User = mongoose.model("user");

require("../models/Post");
const Post = mongoose.model("post");

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

router.get("/", (req, res) => {
  res.render("index", {
    title: "Bitbucket | Git solution for teams using Jira",
  });
});

router.get("/userlist", (req, res) => {
  User.find()
    .then((users) => {
      res.render("userlist", {
        title: "Lista de Usuários",
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

router.get("/posts", (req, res) => {
  Post.find()
    .lean()
    .populate({ path: "posts", strictPopulate: false })
    .sort({ date: "desc" })
    .then((posts) => {
      res.render("posts", { title: "Postagens", posts: posts });
    })
    .catch((err) => {
      req.flash("error_msg", "Houve um erro ao listar as postagens: " + err);
      res.redirect("/");
    });
});

router.get("/posts/add", (req, res) => {
  User.find()
    .then((users) => {
      res.render("postadd", { title: "Nova postagem", users: users });
    })
    .catch((err) => {
      req.flash("error_msg", "Houve um erro ao carregar...");
      res.redirect("/posts");
    });
});

router.post("/posts/new", (req, res) => {
  const newPost = {
    title: req.body.title,
    content: req.body.content,
    description: req.body.description,
  };

  new Post(newPost)
    .save()
    .then(() => {
      req.flash("success_msg", "Postagem criada com sucesso");
      res.redirect("/posts");
    })
    .catch((err) => {
      req.flash("error_msg", "Houve um erro: " + err);
      res.redirect("/posts");
    });
});

router.get("/posts/edit/:id", (req, res) => {
  Post.findOne({ _id: req.params.id })
    .lean()
    .then((post) => {
      res.render("editpost", { title: "Editar postagem", post: post });
    })
    .catch((err) => {
      req.flash("error_msg", "Houve um erro ao carregar... " + err);
      res.redirect("/posts");
    });
});

router.post("/posts/edit", (req, res) => {
  Post.findOneAndUpdate(
    { _id: req.body.id },
    {
      title: req.body.title,
      content: req.body.content,
      description: req.body.description,
    }
  )
    .then(() => {
      req.flash("success_msg", "Postagem editada com sucesso.");
      res.redirect("/posts");
    })
    .catch((err) => {
      req.flash("error_msg", "Erro ao editar a postagem: " + err);
      res.redirect("/posts");
    });
});

router.post("/posts/delete", (req, res) => {
  Post.deleteOne({ _id: req.body.id })
    .then(() => {
      req.flash("success_msg", "Postagem deletada com suceso.");
      res.redirect("/posts");
    })
    .catch((err) => {
      req.flash("error_msg", "Houve um erro ao deletar a postagem.");
      res.redirect("/posts");
    });
});

module.exports = router;
