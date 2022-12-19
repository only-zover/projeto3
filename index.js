const express = require("express");
const http = require("http");
const path = require("path");
const hbs = require("express-handlebars");
const flash = require("connect-flash");
const mongoose = require("mongoose");
const db = require("./config/db");

const index = require("./routes/index");
const admin = require("./routes/admin");
const user = require("./routes/user");
const session = require("express-session");
const passport = require("passport");

require("./models/User");
const User = mongoose.model("user");

require("./config/auth")(passport);

const app = express();

mongoose
  .connect(db.mongoURI)
  .then(() => {
    User.findOne({ username: "Admin" }).then((user) => {
      if (!user) {
        User.create({
          username: "Admin",
          email: "Admin@admin.com",
          password: "Admin",
          isAdm: 1,
        });
      }
    });

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

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
//
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
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
app.use("/user", user);

const PORT = process.env.PORT || 8000;
http.createServer(app).listen(PORT, () => {
  console.log("rodando");
});
