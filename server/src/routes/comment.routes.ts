import { Router } from "express";
import {
  deleteCommentController,
  updateCommentController,
} from "../controllers/comment.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validateBody } from "../middleware/validate.middleware";
import { commentSchema } from "../validators/comment.validator";

const router = Router();

router.patch(
  "/:commentId",
  authenticate,
  validateBody(commentSchema),
  updateCommentController
);

router.delete("/:commentId", authenticate, deleteCommentController);

export default router;