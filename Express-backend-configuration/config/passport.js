const fs = require("fs");
const { ExtractJwt } = require("passport-jwt");
const path = require("path");
const User = require("mongoose").model("User");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractStrategy = require("passport-jwt").ExtractJwt;

const pathToKey = path.join(__dirname, "..", "id_rsa_pub.pem");
const PUB_KEY = fs.readFileSync(pathToKey, "utf8");

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: PUB_KEY,
    algorithms:['RS256']
};

const strategy = new JwtStrategy(options, async (payload, done) => {
  try {
    let user = await User.findOne({ _id: payload.sub });
    if (user) {
      return done(null, user);
    } else {
      done(null, false);
    }
  } catch (err) {
    done(err, null);
  }
});

module.exports = (passport) => {
    passport.use(strategy)
};
