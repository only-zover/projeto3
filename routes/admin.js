const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { isAdm } = require("../modules/isAdm");

require("../models/Post");
const Post = mongoose.model("post");

require("../models/User");
const User = mongoose.model("user");

router.get("/", isAdm, function (req, res) {
  res.render("index", {
    title: "Admin",
  });
});

router.get("/posts", isAdm, (req, res) => {
  Post.find()
    .lean()
    .populate({ path: "posts", strictPopulate: false })
    .sort({ date: "desc" })
    .then((posts) => {
      res.render("admin/posts", { title: "Postagens", posts: posts });
    })
    .catch((err) => {
      req.flash("error_msg", "Houve um erro ao listar as postagens: " + err);
      res.redirect("/");
    });
});

router.get("/posts/add", isAdm, (req, res) => {
  User.find()
    .then((users) => {
      res.render("admin/postadd", { title: "Nova postagem", users: users });
    })
    .catch((err) => {
      req.flash("error_msg", "Houve um erro ao carregar..." + err);
      res.redirect("/posts");
    });
});

router.post("/posts/new", isAdm, (req, res) => {
  const newPost = {
    title: req.body.title,
    content: req.body.content,
    description: req.body.description,
  };

  new Post(newPost)
    .save()
    .then(() => {
      req.flash("success_msg", "Postagem criada com sucesso");
      res.redirect("/admin/posts");
    })
    .catch((err) => {
      req.flash("error_msg", "Houve um erro: " + err);
      res.redirect("/admin/posts");
    });
});

router.get("/posts/edit/:id", isAdm, (req, res) => {
  Post.findOne({ _id: req.params.id })
    .lean()
    .then((post) => {
      res.render("admin/editpost", { title: "Editar postagem", post: post });
    })
    .catch((err) => {
      req.flash("error_msg", "Houve um erro ao carregar... " + err);
      res.redirect("/admin/posts");
    });
});

router.post("/posts/edit", isAdm, (req, res) => {
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
      res.redirect("/admin/posts");
    })
    .catch((err) => {
      req.flash("error_msg", "Erro ao editar a postagem: " + err);
      res.redirect("/admin/posts");
    });
});

router.post("/posts/delete", isAdm, (req, res) => {
  Post.deleteOne({ _id: req.body.id })
    .then(() => {
      req.flash("success_msg", "Postagem deletada com suceso.");
      res.redirect("/admin/posts");
    })
    .catch((err) => {
      req.flash("error_msg", "Houve um erro ao deletar a postagem: " + err);
      res.redirect("/admin/posts");
    });
});
// user stuff
router.get("/userlist", isAdm, (req, res) => {
  User.find()
    .then((users) => {
      res.render("admin/userlist", {
        title: "Lista de Usuários",
        users: users.map((users) => users.toJSON()),
      });
    })
    .catch((err) => {
      req.flash("error_msg", "Houve um erro ao listar os usuários.");
      res.redirect("index");
    });
});

router.get("/userlist/edit:id", isAdm, (req, res) => {
  User.findOne({ _id: req.params.id.slice(1) })
    .lean()
    .then((users) => {
      res.render("admin/edituser", {
        users: users,
      });
    })
    .catch((err) => {
      req.flash("error_msg", "Esse usuário não existe");
      res.redirect("/admin/userlist");
    });
});

router.post("/userlist/edit", isAdm, (req, res) => {
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
      res.redirect("/admin/userlist");
    })
    .catch((err) => {
      req.flash("error_msg", "ERRO: " + err);
      res.redirect("/admin/userlist");
    });
});

router.post("/userlist/delete", isAdm, (req, res) => {
  User.deleteOne({ _id: req.body.id })
    .then(() => {
      req.flash("success_msg", "Usuário deletado com sucesso.");
      res.redirect("/admin/userlist");
    })
    .catch((err) => {
      req.flash("error_msg", "Houve um erro ao deletar o usuário.");
      res.redirect("/admin/userlist");
    });
});

module.exports = router;
