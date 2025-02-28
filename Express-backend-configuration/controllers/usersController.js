const User = require("../models/user");
const passport = require("passport");
const utils = require("../lib/utils");
const { body, validationResult } = require("express-validator");

// Example of route that needs authentication to be accessed

exports.user_authenticate = [
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    console.log('authorized')
    res.status(200).json({ success: true, msg: "You are authorized" });
  },
];

// Login User

exports.user_login = [
  async function (req, res, next) {
    try {
      const { username, password } = req.body;
      let user = await User.findOne({ username: username.toLowerCase() });
      if (!user) {
        return res
          .status(401)
          .json({ success: false, msg: "could not find user" });
      }
      const isValid = utils.validPassword(
        password,
        user.hash,
        user.salt
      );
      if (isValid) {
        const jwt = await utils.issueJWT(user, '30 minutes');
        const refreshToken = await utils.issueJWT(user, '24 hours')
        return res
          .status(200)
          .json({
            success: true,
            token: jwt.token,
            expiresIn: jwt.expires,
            refreshToken: refreshToken.token,
            id: user._id,
          });
      }
      return res
        .status(401)
        .json({ success: false, msg: "you entered the wrong password" });
    } catch (err) {
      console.log(err);
      next(err);
    }
  },
];

// Refresh Token

exports.user_refresh_token = [
  async function (req, res, next) {
    console.log('refreshing...')
    const refreshToken = req.body.refresh;
    if (!refreshToken) {
          console.log("user not found");
      return res
        .status(401)
        .json({ success: false, msg: "Refresh token not provided" });
    }
    try {
      const decoded = await utils.verifyToken(refreshToken.split(' ')[1]);
      const user = await User.findOne({ _id: decoded.sub });
      if (!user) {
        return res.status(401).json({ success: false, msg: "User not found" });
      }
      const newAccessToken = await utils.issueJWT(user, '45 minutes');
      res.status(200).json({ success: true, token: newAccessToken.token, expiresIn: newAccessToken.expires });
    } catch (err) {
      console.log(err);
      return res
        .status(403)
        .json({ success: false, msg: "Invalid refresh token" });
    }
  },
];

// Register user

// const validateRegisterEmail = [
//   body("email")
//     .isEmail()
//     .withMessage("Please provide a valid email address")
//     .normalizeEmail(),
// ];

const checkUserExists = async (req, res, next) => {
  try {
    const { username } = req.body;
    const userExists = await User.findOne({ username: username.toLowerCase() });
    if (userExists) {
      return res
        .status(409)
        .json({ success: false, msg: "User already exists" });
    }
    next();
  } catch (err) {
    next(err);
  }
};

const registerUser = async (req, res, next) => {
  try {
    console.log('hola')
    const { username, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, msg: errors.array() });
    }
    const saltHash = utils.genPassword(password);
    const salt = saltHash.salt;
    const hash = saltHash.hash;
    let user = new User({
      username: username.toLowerCase(),
      hash: hash,
      salt: salt,
    });
    let newUser = await user.save();
    const jwt = await utils.issueJWT(user, '30 minutes');
    res.json({
      success: true,
      user: newUser,
      token: jwt.token,
      expiresIn: jwt.expires,
    });
  } catch (err) {
    next(err);
  }
};

exports.user_register = [
  // ...validateRegisterEmail,
  checkUserExists,
  registerUser,
];

// End of register user
