const express = require("express");
const http = require("http");
const path = require("path");
const hbs = require("express-handlebars");
const flash = require("connect-flash");
const mongoose = require("mongoose");

const index = require("./routes/index");
const admin = require("./routes/admin");
const session = require("express-session");

const app = express();

mongoose
  .connect("mongodb://localhost:27017/mongo")
  .then(() => {
    console.log("Mongo on");
  })
  .catch((err) => {
    console.log(`ERRO: ${err}`);
  });
//
app.use(
  session({
    secret: "aaa123",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());
//
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});
//
app.use(express.static(path.join(__dirname, "public")));

app.engine("handlebars", hbs.engine({ defaultLayout: "layout" }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/", index);
app.use("/admin", admin);

http.createServer(app).listen(8000, () => {
  console.log("Rodando...");
});
