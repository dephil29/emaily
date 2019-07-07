const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const passport = require("passport");
const keys = require("./config/keys");
require("./models/User");
require("./services/passport");

mongoose.connect(keys.mongoURI, { useNewUrlParser: true });

const app = express();

// middleware
// app.use(bodyParser.json());
app.use(express.json());
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);
app.use(passport.initialize());
app.use(passport.session());

//routes
require("./routes/authRoutes")(app);
require("./routes/billingRoutes")(app);

// if (process.env.NODE_ENV === "production") {
//   const path = require("path");
//   app.use(express.static("/client/build"));
//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
//   });
// }

if (process.env.NODE_ENV === "production") {
  const path = require("path"); //We need path earlier for this!
  app.use(express.static(path.join(__dirname, "/client/build")));
  //No more changes from here on now
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`listening on port ${PORT}`));
