import { Router } from "express";
import verifyToken from "../middlewares/verifyToken";
import searchController from "../controllers/search";

const router = Router();

router.get("/search/:type", verifyToken, searchController.get);

export default router;
