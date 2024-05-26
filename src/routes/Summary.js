import { Router } from "express";
import SummaryController from "../controllers/Summary";
import authMiddleware from "../middlewares/auth";

const router = Router();

// Rota para obter o resumo financeiro total
router.get("/", authMiddleware, SummaryController.getFinancialSummary);

// Rota para obter o resumo financeiro agrupado por mês
router.get(
  "/monthly-summary",
  authMiddleware,
  SummaryController.getMonthlyFinancialSummary
);
router.get(
  "/expenses-category",
  authMiddleware,
  SummaryController.getCategorySummary
);

router.get("/expenses-types", authMiddleware, SummaryController.getTypeSummary);

router.get(
  "/expenses-methods",
  authMiddleware,
  SummaryController.getMethodSummary
);

export default router;
