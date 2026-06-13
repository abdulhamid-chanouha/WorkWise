import { Request, Response, NextFunction } from "express";
import {
  createComment,
  deleteComment,
  updateComment,
} from "../services/comment.service";

export const createCommentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const taskId = req.params.id as string;
    const user = (req as any).user;
    const { content } = req.body;

    const comment = await createComment(taskId, user.userId, content);

    return res.status(201).json({
      success: true,
      message: "Comment added successfully",
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCommentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const commentId = req.params.commentId as string;
    const user = (req as any).user;
    const { content } = req.body;

    const comment = await updateComment(commentId, user.userId, content);

    return res.status(200).json({
      success: true,
      message: "Comment updated successfully",
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCommentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const commentId = req.params.commentId as string;
    const user = (req as any).user;

    await deleteComment(commentId, user.userId);

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};