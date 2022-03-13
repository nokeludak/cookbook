import authController from "./controllers/auth.controller";
import cacheController from "./controllers/cache.controller";
import categoriesController from "./controllers/categories.controller";
import reciepeController from "./controllers/reciepe.controller";
import userController from "./controllers/user.controller";
const express = require("express");
import fileUpload from "./middleware/multer";

const router = express.Router();

router.route("/user").get(userController.list);
router.route("/user/create").post(userController.create);
router.param("userId", userController.userByID);
router
  .route("/user/:userId")
  .get(authController.requireSignin, userController.read)
  .put(
    authController.requireSignin,
    authController.hasAuthorization,
    userController.update
  )
  .delete(
    authController.requireSignin,
    authController.hasAuthorization,
    userController.remove
  );

router.route("/auth/signin").post(authController.signin);
router.route("/auth/signout").post(authController.signout);

router.route("/categories").get(categoriesController.sendData);
router.route("/cache").get(cacheController.getCache);

router.route("/recipe").get(reciepeController.list);
router
  .route("/recipe/create")
  .post(fileUpload.single("img"), reciepeController.create);

router.param("recipeId", reciepeController.reciepeById);
router
  .route("/recipe/:recipeId")
  .get(reciepeController.read)
  .put(fileUpload.single("img"), reciepeController.update)
  .delete(reciepeController.remove);

router.param("author", reciepeController.reciepeByUser);
router.route("/recipe/author/:author").get(reciepeController.listByUser);

export default router;
