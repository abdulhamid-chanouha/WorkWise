import prisma from "../utils/prisma";
import { NotFoundError } from "../errors/NotFoundError";
import { UnauthorizedError } from "../errors/UnauthorizedError";

export const createComment = async (
  taskId: string,
  authorId: string,
  content: string
) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!task) {
    throw new NotFoundError("Task not found");
  }

  const comment = await prisma.comment.create({
    data: {
      taskId,
      authorId,
      content,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  await prisma.taskActivity.create({
    data: {
      taskId,
      userId: authorId,
      action: "COMMENT_ADDED",
      details: "A comment was added to the task",
    },
  });

  return comment;
};

export const updateComment = async (
  commentId: string,
  userId: string,
  content: string
) => {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  });

  if (!comment) {
    throw new NotFoundError("Comment not found");
  }

  if (comment.authorId !== userId) {
    throw new UnauthorizedError("You can only edit your own comments");
  }

  return prisma.comment.update({
    where: { id: commentId },
    data: { content },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

export const deleteComment = async (
  commentId: string,
  userId: string
) => {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  });

  if (!comment) {
    throw new NotFoundError("Comment not found");
  }

  if (comment.authorId !== userId) {
    throw new UnauthorizedError("You can only delete your own comments");
  }

  await prisma.comment.delete({
    where: { id: commentId },
  });

  return comment;
};