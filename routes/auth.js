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

      // PROFILE is:::

      //   profile: {
      //     provider: 'strava',
      //     id: 115765,
      //     fullName: 'Andrew Hudson',
      //     name: { familyName: 'Hudson', givenName: 'Andrew' },
      //     photos: [ [Object], [Object] ],
      //     token: 'd4c09f9cea4bf25571eba302d0a83cc147e08510',
      //     _raw: '{"id":115765,"username":"andrew-hudson","resource_state":2,"firstname":"Andrew","lastname":"Hudson","bio":"","city":"Wallingford","state":"England","country":"United Kingdom","sex":"M","premium":true,"summit":true,"created_at":"2011-07-26T13:26:36Z","updated_at":"2022-09-07T13:44:56Z","badge_type_id":1,"weight":77.1107,"profile_medium":"https://dgalywyr863hv.cloudfront.net/pictures/athletes/115765/4822347/5/medium.jpg","profile":"https://dgalywyr863hv.cloudfront.net/pictures/athletes/115765/4822347/5/large.jpg","friend":null,"follower":null}',
      //     _json: {
      //       id: 115765,
      //       username: 'andrew-hudson',
      //       resource_state: 2,
      //       firstname: 'Andrew',
      //       lastname: 'Hudson',
      //       bio: '',
      //       city: 'Wallingford',
      //       state: 'England',
      //       country: 'United Kingdom',
      //       sex: 'M',
      //       premium: true,
      //       summit: true,
      //       created_at: '2011-07-26T13:26:36Z',
      //       updated_at: '2022-09-07T13:44:56Z',
      //       badge_type_id: 1,
      //       weight: 77.1107,
      //       profile_medium: 'https://dgalywyr863hv.cloudfront.net/pictures/athletes/115765/4822347/5/medium.jpg',
      //       profile: 'https://dgalywyr863hv.cloudfront.net/pictures/athletes/115765/4822347/5/large.jpg',
      //       friend: null,
      //       follower: null
      //     }
      //   },
      //   accessToken: 'd4c09f9cea4bf25571eba302d0a83cc147e08510',
      //   refreshToken: '720a3d39e73b5476be78e98414f093475c24d1c9'
      // }

      return cb(null, profile);
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
  passport.authenticate("strava")
);

router.get(
  "/oauth2/redirect/strava",
  passport.authenticate("strava", {
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
