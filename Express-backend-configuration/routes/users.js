const router = require("express").Router();
const userController = require("../controllers/usersController");

router.get("/protected", userController.user_authenticate);
router.post("/login", userController.user_login);
router.post("/register", userController.user_register);
router.post('/refresh', userController.user_refresh_token);

module.exports = router;
