import User from "../models/user.model";
import _, { join } from "lodash";
import errorHandler from "../helpers/dbErrorHandler";
const crypto = require("crypto");
import cachedUser from "../../../cache/cachedUser";

const encryptPassword = (password, salt) => {
  try {
    return crypto.createHmac("sha1", salt).update(password).digest("hex");
  } catch (err) {
    return "";
  }
};

const userByID = (req, res, next, id) => {
  User.findById(id)
    .populate("employee")
    .exec((err, user) => {
      if (err || !user) {
        return res.json({ error: "User not found" });
      }
      req.profile = user;
      next();
    });
};

const create = (req, res, next) => {
  const user = new User(req.body);

  user.save((err, result) => {
    if (err) {
      return res.json({ error: errorHandler.getErrorMessage(err) });
    }
    res.status(200).json({ message: "Successfully created account!" });
  });
};

const list = (req, res) => {
  User.find((err, users) => {
    if (err) {
      return res.json({
        error: errorHandler.getErrorMessage(err),
      });
    }
    res.json(users);
  }).select("_id name email");
};

const read = (req, res) => {
  res.status(200).json(req.profile);
};

const remove = (req, res, next) => {
  let user = req.profile;
  user.remove((err, deletedUser) => {
    if (err) {
      return res.json({ error: errorHandler.getErrorMessage(err) });
    }
    deletedUser.hashed_password = undefined;
    deletedUser.salt = undefined;
    cachedUser._id = "";
    cachedUser.name = "";
    cachedUser.email = "";
    cachedUser.hashed_password = "";
    res.json(deletedUser);
  });
};

const update = (req, res, next) => {
  let user = req.profile;
  let data = req.body;

  if (data.password) {
    if (data.password !== "") {
      data.hashed_password = encryptPassword(data.password, user.salt);
      delete data.password;
    }
  }

  user = _.extend(user, data);
  user.updated = Date.now();

  user.save((err) => {
    if (err) {
      return res.json({ error: errorHandler.getErrorMessage(err) });
    }
    cachedUser._id = user._id;
    cachedUser.name = user.name;
    cachedUser.email = user.email;
    cachedUser.hashed_password = user.hashed_password;
    user.hashed_password = undefined;
    user.salt = undefined;
    res.status(200).json(user);
  });
};

export default { create, list, userByID, read, update, remove };
