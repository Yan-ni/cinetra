const router = require("express").Router();
const verifyToken = require("../middlewares/verifyToken");
const showController = require("../controllers/show");

router.get("/show/:id?", verifyToken, showController.get);
router.post("/show", verifyToken, showController.post);
router.put("/show/:id", verifyToken, showController.put.show);
router.put(
  "/show/:id/complete",
  verifyToken,
  showController.put.toggleComplete
);
router.delete("/show/:id", verifyToken, showController.delete);

module.exports = router;
