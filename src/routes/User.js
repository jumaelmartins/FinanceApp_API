import { Router } from "express";
import UserController from "../controllers/User.js";
import authMiddleware from "../middlewares/auth.js";

const router = Router();

router.get("/", authMiddleware, UserController.show);
router.post("/", UserController.store);
router.put("/", authMiddleware, UserController.update);

export default router;
