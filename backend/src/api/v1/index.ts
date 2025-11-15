import {Router} from "express";
import authRouter from "./auth";
import showRouter from "./show";
import movieRouter from "./movie";
import userRouter from "./user";
import { protectedRoute } from "../../middlewares/protectedRoute";

const router = Router();

router.use("/auth", authRouter);
router.use("/show", protectedRoute, showRouter);
router.use("/movie", protectedRoute, movieRouter);
router.use("/user", userRouter);

export default router;