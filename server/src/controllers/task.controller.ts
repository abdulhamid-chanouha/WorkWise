import { Request, Response, NextFunction } from "express";
import { createTask } from "../services/task.service";

export const createTaskController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (req as any).user;

    const task = await createTask({
      ...req.body,
      creatorId: user.userId,
    });

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};