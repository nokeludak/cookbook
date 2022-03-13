import User from "../models/user.model";
import jwt from "jsonwebtoken";
import expressJwt from "express-jwt";
import config from "./../config/config";
import cachedUser from "../../../cache/cachedUser";

const signin = (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err || !user) {
      return res.json({ error: "User not found" });
    }

    if (!user.authenticate(req.body.password)) {
      return res.json({ error: "Email and password don't match" });
    }

    cachedUser._id = user._id;
    cachedUser.email = user.email;
    cachedUser.name = user.name;
    cachedUser.hashed_password = user.hashed_password;

    const token = jwt.sign({ _id: user._id }, config.jwtSecret);

    res.cookie("t", token, { expire: new Date() + 9999 });

    return res.status(200).json({
      token,
    });
  });
};

const signout = (req, res) => {
  res.clearCookie("t");

  cachedUser._id = "";
  cachedUser.email = "";
  cachedUser.name = "";
  cachedUser.hashed_password = "";

  return res.status(200).json({ message: "signed out" });
};

const requireSignin = expressJwt({
  secret: config.jwtSecret,
  algorithms: ["HS256"],
  userProperty: "auth",
});

const hasAuthorization = (req, res, next) => {
  const authorized = req.profile && req.auth && req.profile._id == req.auth._id;

  if (!authorized) {
    return res.status(403).json({ error: "User is not authorized" });
  }

  next();
};

export default { signin, signout, requireSignin, hasAuthorization };
