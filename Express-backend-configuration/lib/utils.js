const crypto = require("crypto");
const jsonwebtoken = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const jose = require("jose");

const pathToKey = path.join(__dirname, "..", "id_rsa_priv.pem");
const pathToPub = path.join(__dirname, "..", "id_rsa_pub.pem");
const PRIV_KEY = process.env.PRIVATE_KEY.replace(/\\n/g, "\n");
const PUB_KEY = fs.readFileSync(pathToPub, "utf8");

function validPassword(password, hash, salt) {
  var hashVerify = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return hash === hashVerify;
}

function genPassword(password) {
  var salt = crypto.randomBytes(32).toString("hex");
  var genHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");

  return {
    salt: salt,
    hash: genHash,
  };
}

async function issueJWT(user, time) {
  const privateKey = await jose.importPKCS8(PRIV_KEY, "RS256");
  const _id = user._id;

  const payload = {
    sub: _id,
  };

  const jwt = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "RS256" })
    .setIssuedAt()
    .setExpirationTime(time)
    .sign(privateKey);

  return {
    token: "Bearer " + jwt,
    expires: time,
  };
}

function verifyToken(token) {
  return jsonwebtoken.verify(token, PUB_KEY, { algorithms: ["RS256"] });
}

module.exports.validPassword = validPassword;
module.exports.genPassword = genPassword;
module.exports.issueJWT = issueJWT;
module.exports.verifyToken = verifyToken;
