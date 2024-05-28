import { Router } from "express";
import PayMethodController from "../controllers/PayMethod";
import authMiddleware from "../middlewares/auth";

const router = Router();

router.get("/", authMiddleware, PayMethodController.index);
router.post("/", authMiddleware, PayMethodController.store);
router.put("/:id", authMiddleware, PayMethodController.update);
router.delete("/:id", authMiddleware, PayMethodController.delete);

export default router;
