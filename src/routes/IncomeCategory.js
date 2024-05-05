import { Router } from "express";
import IncomeCategoryController from "../controllers/IncomeCategory";
import authMiddleware from "../middlewares/auth";

const router = Router();

router.get("/", authMiddleware, IncomeCategoryController.index);
router.post("/", authMiddleware, IncomeCategoryController.store);
router.put("/", authMiddleware, IncomeCategoryController.update);
router.delete("/", authMiddleware, IncomeCategoryController.delete);

export default router;
