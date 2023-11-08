const router = require("express").Router();
const verifyToken = require("../middlewares/verifyToken");
const movieController = require("../controllers/movie");

router.get("/movie/:id?", verifyToken, movieController.get);
router.post("/movie", verifyToken, movieController.post);
router.put("/movie/:id", verifyToken, movieController.put);
router.delete("/movie/:id", verifyToken, movieController.delete);

module.exports = router;
