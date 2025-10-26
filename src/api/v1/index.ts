import {Router} from "express";
import authRouter from "./auth";
import showRouter from "./show";
import { protectedRoute } from "../../middlewares/protectedRoute";

const router = Router();

router.use("/auth", authRouter);
router.use("/show", protectedRoute, showRouter);

export default router;