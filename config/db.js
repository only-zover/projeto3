if (process.env.NODE_ENV == "production") {
  module.exports = {
    mongoURI:
      "mongodb+srv://zover:UzI9QukVlwSjXtjm@projeto3.idrgdfc.mongodb.net/?retryWrites=true&w=majority",
  };
} else {
  module.exports = { mongoURI: "mongodb://localhost:27017/mongo" };
}
