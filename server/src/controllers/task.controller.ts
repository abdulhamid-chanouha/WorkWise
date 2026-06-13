import { Request, Response, NextFunction } from "express";
import { createTask, getTaskById, updateTask } from "../services/task.service";

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
export const getTaskByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const taskId = req.params.id as string;
    const task = await getTaskById(taskId);

    return res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};
export const updateTaskController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const taskId = req.params.id as string;

    const user = (req as any).user;

    const task = await updateTask(taskId, {
      ...req.body,
      userId: user.userId,
    });

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};