const express = require("express");
const router = express.Router();

router.get("/", function (req, res) {
  res.render("index", {
    title: "admin",
  });
});

router.get("/outro", function (req, res) {
  res.render("outro", {
    title: "outro",
  });
});

router.get("/teste", function (req, res) {
  res.render("teste", {
    title: "teste",
  });
});

module.exports = router;
