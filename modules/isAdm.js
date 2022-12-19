module.exports = {
  isAdm: function (req, res, next) {
    if (req.isAuthenticated() && req.user.isAdm == 1) {
      return next();
    } else {
      req.flash("error_msg", "Você precisa ser um administrador para entrar");
      res.redirect("/");
    }
  },
};
