const router = require("express").Router();
const verifyToken = require("../middlewares/verifyToken");
const searchController = require("../controllers/search");

router.get("/search/:type", verifyToken, searchController.get);

module.exports = router;
