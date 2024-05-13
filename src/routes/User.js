import { Router } from "express";
import UserController from "../controllers/User";
import authMiddleware from "../middlewares/auth";

const router = Router();

router.get("/", UserController.show);
router.post("/", UserController.store);
router.put("/", authMiddleware, UserController.update);

export default router;
