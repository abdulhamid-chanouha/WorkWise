import { Router } from "express";
import {
  createTaskController,
  getTaskByIdController,
  updateTaskController,
} from "../controllers/task.controller";
import { createCommentController } from "../controllers/comment.controller";
import { commentSchema } from "../validators/comment.validator";
import { authenticate } from "../middleware/auth.middleware";
import { validateBody } from "../middleware/validate.middleware";
import { createTaskSchema } from "../validators/task.validator";

const router = Router();

router.post(
  "/",
  authenticate,
  validateBody(createTaskSchema),
  createTaskController
);

router.get("/:id", authenticate, getTaskByIdController);

router.patch("/:id", authenticate, updateTaskController);
router.post(
  "/:id/comments",
  authenticate,
  validateBody(commentSchema),
  createCommentController
);


export default router;