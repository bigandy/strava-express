var express = require("express");

var router = express.Router();

/* GET home page. */
router.get(
  "/",
  function (req, res, next) {
    if (!req.user) {
      return res.render("home");
    }
    next();
  },
  // fetchActivities,
  function (req, res, next) {
    res.locals.filter = null;

    // console.log({ user: req.user });

    res.render("index", {
      user: req.user.user,
      accessToken: req.user.accessToken,
    });
  }
);

module.exports = router;
