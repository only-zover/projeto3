const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

require("../models/User");
const User = mongoose.model("user");

router.get("/", (req, res) => {
  res.render("index", {
    title: "Bitbucket | Git solution for teams using Jira",
  });
});

module.exports = router;
