import { Router } from "express";
import verifyToken from "../middlewares/verifyToken";
import showController from "../controllers/show";

const router = Router();

router.get("/show/:id?", verifyToken, showController.get);
router.post("/show", verifyToken, showController.post);
router.put("/show/:id", verifyToken, showController.put);
router.delete("/show/:id", verifyToken, showController.delete);

export default router;
