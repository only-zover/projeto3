const mongoose = require("mongoose");
require("../models/User");
const User = mongoose.model("user");

if (process.env.NODE_ENV == "production") {
  module.exports = {
    mongoURI:
      "mongodb+srv://vercel-admin-user:UzI9QukVlwSjXtjm@cluster0.av6abin.mongodb.net/?retryWrites=true&w=majority",
  };
} else {
  module.exports = { mongoURI: "mongodb://localhost:27017/mongo" };
}
