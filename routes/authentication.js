const router = require("express").Router();
const authentocationController = require("../controllers/authentication");

router.post("/login", authentocationController.login.post);
router.post("/signup", authentocationController.signup.post);

module.exports = router;
