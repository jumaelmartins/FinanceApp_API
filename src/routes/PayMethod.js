import { Router } from "express";
import PayMethodController from "../controllers/PayMethod";
import authMiddleware from "../middlewares/auth";

const router = Router();

router.get("/", authMiddleware, PayMethodController.index);
router.post("/", authMiddleware, PayMethodController.store);
router.put("/", authMiddleware, PayMethodController.update);
router.delete("/", authMiddleware, PayMethodController.delete);

export default router;
