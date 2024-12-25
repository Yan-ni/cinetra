import {Router} from "express";
import verifyToken from "../middlewares/verifyToken";
import movieController from "../controllers/movie";

const router = Router();

router.get("/movie/:id?", verifyToken, movieController.get);
router.post("/movie", verifyToken, movieController.post);
router.put("/movie/:id", verifyToken, movieController.put);
router.delete("/movie/:id", verifyToken, movieController.delete);

export default router;
