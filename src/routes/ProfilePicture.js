import { Router } from "express";
import ProfilePictureController from "../controllers/ProfilePicture";
import authMiddleware from "../middlewares/auth";

const router = Router();

router.get("/", authMiddleware, ProfilePictureController.index);
router.post("/", authMiddleware, ProfilePictureController.store);
router.delete("/", authMiddleware, ProfilePictureController.delete);

export default router;
