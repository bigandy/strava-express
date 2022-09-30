var express = require("express");

var router = express.Router();

const stravaApi = require("strava-v3");

async function fetchActivities(accessToken) {
  try {
    console.log("Getting Activities");

    strava = new stravaApi.client(accessToken);

    const payload = await strava.athlete
      .listActivities({
        page: 1,
        per_page: 100,
      })
      .filter(
        (act) =>
          act.average_speed < 2.5 &&
          act.sport_type === "Run"
      )
      .map(
        ({
          name,
          type,
          sport_type,
          average_speed,
          max_speed,
          id,
        }) => {
          return {
            id,
            name,
            newName: name.replace(/run/gi, "walk"),
            type,
            // new_sport_type: "Walk",
            sport_type,
            average_speed,
            max_speed,
          };
        }
      );

    // if (payload.length > 0) {
    //   // turn the first into a run
    //   var args = {
    //     id: payload[0].id,
    //     name: payload[0].newName,
    //     sport_type: "Walk",
    //     type: "Walk",
    //   };
    //   const updated = await strava.activities.update(args);
    //   console.log({ updated });
    // }

    return payload;
  } catch (error) {
    console.error("error in fetchActivities", error);
    return null;
  }
}

/* GET activities page. */
router.get("/activities", async function (req, res, next) {
  if (!req.user) {
    return res.redirect("/");
  }

  res.locals.filter = null;

  // console.log({ user: req });

  let activities = null;
  if (req?.user?.accessToken) {
    activities = await fetchActivities(
      req?.user?.accessToken
    );
  }

  // console.log({ activities });

  res.send({
    // hello: "world",
    // user: req?.user?.user ?? "empty-user",
    // accessToken: req?.user?.accessToken ?? "empty-token",
    activities,
    // user: req.user.user,
    // accessToken: req.user.accessToken,
  });
});

/* GET activities page. */
router.post(
  "/activity/:id",
  async function (req, res, next) {
    if (!req.user) {
      return res.redirect("/");
    }

    res.locals.filter = null;

    console.log({ req });

    // let activities = null;
    // if (req?.user?.accessToken) {
    //   activities = await fetchActivities(
    //     req?.user?.accessToken
    //   );
    // }

    console.log({ activities });

    res.send({
      hello: "world",
      // user: req?.user?.user ?? "empty-user",
      // accessToken: req?.user?.accessToken ?? "empty-token",
      // activities: activities,
      // user: req.user.user,
      // accessToken: req.user.accessToken,
    });
  }
);

module.exports = router;
