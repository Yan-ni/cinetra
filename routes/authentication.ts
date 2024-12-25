import { Router } from "express";
import verifyToken from "../middlewares/verifyToken";
import authenticationController from "../controllers/authentication";

const router = Router();

router.post("/login", authenticationController.login.post);
router.post("/signup", authenticationController.signup.post);
router.put("/password", verifyToken, authenticationController.password.put);

export default router;
