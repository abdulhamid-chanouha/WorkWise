import bcrypt from "bcryptjs";
import { createHash, randomBytes } from "crypto";
import prisma from "../utils/prisma";
import { sendPasswordResetEmail } from "./mail.service";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";


const DEFAULT_ROLE = "DEVELOPER";

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email: normalizedEmail,
      password: hashedPassword,
    },
  });

  const accessToken = generateAccessToken(user.id, DEFAULT_ROLE);
  const refreshToken = generateRefreshToken(user.id, DEFAULT_ROLE);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    accessToken,
    refreshToken,
  };
};


export const loginUser = async (
  email: string,
  password: string
) => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const accessToken = generateAccessToken(user.id, DEFAULT_ROLE);
  const refreshToken = generateRefreshToken(user.id, DEFAULT_ROLE);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    accessToken,
    refreshToken,
  };
};

export const refreshUserToken = async (refreshToken: string) => {
  const decoded = verifyRefreshToken(refreshToken) as unknown as {
    userId: string;
    role: string;
  };

  const accessToken = generateAccessToken(decoded.userId, decoded.role);
  const newRefreshToken = generateRefreshToken(decoded.userId, decoded.role);

  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
};

const hashResetToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");

export const requestPasswordReset = async (email: string) => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: { id: true, name: true, email: true },
  });

  // Keep the response identical for unknown emails to prevent account discovery.
  if (!user) return;

  await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });

  const resetToken = randomBytes(32).toString("hex");
  const tokenRecord = await prisma.passwordResetToken.create({
    data: {
      tokenHash: hashResetToken(resetToken),
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      userId: user.id,
    },
  });

  try {
    await sendPasswordResetEmail({
      to: user.email,
      recipientName: user.name,
      resetToken,
    });
  } catch (error) {
    await prisma.passwordResetToken.delete({ where: { id: tokenRecord.id } });
    throw error;
  }
};

export const resetPassword = async (token: string, password: string) => {
  const tokenRecord = await prisma.passwordResetToken.findUnique({
    where: { tokenHash: hashResetToken(token) },
  });

  if (!tokenRecord || tokenRecord.expiresAt <= new Date()) {
    if (tokenRecord) {
      await prisma.passwordResetToken.delete({ where: { id: tokenRecord.id } });
    }
    throw new Error("INVALID_OR_EXPIRED_RESET_TOKEN");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.$transaction([
    prisma.user.update({
      where: { id: tokenRecord.userId },
      data: { password: hashedPassword },
    }),
    prisma.passwordResetToken.deleteMany({ where: { userId: tokenRecord.userId } }),
  ]);
};
