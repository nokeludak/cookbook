import Reciepe from "../models/reciepe.model";
import dbErrorHandler from "../helpers/dbErrorHandler";
import _ from "lodash";

const reciepeById = (req, res, next, id) => {
  Reciepe.findById(id)
    .populate("author")
    .exec((err, reciepe) => {
      if (err || !reciepe) {
        return res.json({ error: "Reciepe not found!" });
      }
      req.profile = reciepe;
      next();
    });
};

const create = (req, res, next) => {
  let reciepe = {};

  if (req.file) {
    reciepe = new Reciepe({
      name: req.body.name,
      description: req.body.description,
      author: req.body.author,
      ingredients: req.body.ingredients,
      category: req.body.category,
      instructions: req.body.instructions,
      rating: req.body.rating,
      picture: req.file.filename,
    });
  } else {
    reciepe = new Reciepe({
      name: req.body.name,
      description: req.body.description,
      author: req.body.author,
      ingredients: req.body.ingredients,
      category: req.body.category,
      instructions: req.body.instructions,
      rating: req.body.rating,
      picture: "avatar",
    });
  }

  delete reciepe.img;
  reciepe.save((err, result) => {
    if (err) {
      return res.json({ error: dbErrorHandler.getErrorMessage(err) });
    }

    res.status(200).json({ message: "Successfully added Reciepe" });
  });
};

const list = (req, res) => {
  Reciepe.find((err, reciepes) => {
    if (err) {
      return res.json({ error: dbErrorHandler.getErrorMessage(err) });
    }

    res.json(reciepes);
  }).populate("author");
};

const read = (req, res) => {
  res.status(200).json(req.profile);
};

const update = (req, res, next) => {
  let reciepe = req.profile;
  let data = req.body;

  if (req.file) {
    data.picture = req.file.filename;
    delete data.img;
  }

  reciepe = _.extend(reciepe, data);

  reciepe.save((err) => {
    if (err) {
      return res.json({ error: dbErrorHandler.getErrorMessage(err) });
    }

    res.status(200).json(reciepe);
  });
};

const remove = (req, res) => {
  let reciepe = req.profile;

  reciepe.remove((err, deletedReciepe) => {
    if (err) {
      return res.json({ error: dbErrorHandler.getErrorMessage(err) });
    }

    res.json({ message: "Reciepe deleted!" });
  });
};

const reciepeByUser = (req, res, next) => {
  let query = req.params.author;
  Reciepe.find({ author: query })
    .populate("author")
    .exec((err, reciepes) => {
      if (err || !reciepes) {
        return res.json({ error: "Reciepes not found!" });
      }

      req.profile = reciepes;
      next();
    });
};

const listByUser = (req, res) => {
  res.status(200).json(req.profile);
};

export default {
  reciepeById,
  create,
  list,
  read,
  update,
  reciepeByUser,
  listByUser,
  remove,
};
