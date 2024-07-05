const router = require("express").Router();
const verifyToken = require("../middlewares/verifyToken");
const authentocationController = require("../controllers/authentication");

router.post("/login", authentocationController.login.post);
router.post("/signup", authentocationController.signup.post);
router.put("/password", verifyToken, authentocationController.password.put);

module.exports = router;
