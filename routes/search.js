const router = require("express").Router();
const verifyToken = require("../middlewares/verifyToken");
const searchController = require("../controllers/search");

router.get("/search/show", verifyToken, searchController.get.show);
router.get("/search/movie", verifyToken, searchController.get.movie);

module.exports = router;
