var express = require("express");
var passport = require("passport");
const StravaStrategy =
  require("@riderize/passport-strava-oauth2").Strategy;

passport.use(
  new StravaStrategy(
    {
      clientID: process.env.STRAVA_CLIENT_ID,
      clientSecret: process.env.STRAVA_CLIENT_SECRET,
      callbackURL: `http://127.0.0.1:${process.env.PORT}/oauth2/redirect/strava`,
    },
    function verify(
      accessToken,
      refreshToken,
      profile,
      cb
    ) {
      console.log({ profile, accessToken, refreshToken });

      return cb(null, { user: profile, accessToken });
    }
  )
);

passport.serializeUser(function (profile, cb) {
  process.nextTick(function () {
    cb(null, profile);
  });
});

passport.deserializeUser(function (profile, cb) {
  process.nextTick(function () {
    return cb(null, profile);
  });
});

var router = express.Router();

router.get("/login", function (req, res, next) {
  res.render("login");
});

router.get(
  "/login/federated/strava",
  passport.authenticate("strava", {
    scope: [
      "profile:read_all,activity:read_all,activity:write",
    ],
  })
);

router.get(
  "/oauth2/redirect/strava",
  passport.authenticate("strava", {
    // scope: [
    //   "profile:read_all,activity:read_all,activity:write",
    // ],
    successReturnToOrRedirect: "/",
    failureRedirect: "/login",
  })
);

router.post("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = router;
