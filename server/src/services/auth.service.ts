import bcrypt from "bcryptjs";
import prisma from "../utils/prisma";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt";

export const registerUser = async (name: string, email: string, password: string) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      id: crypto.randomUUID(),
      name,
      email,
      password: hashedPassword,
      updatedAt: new Date(),
    },
  });

  const accessToken = generateAccessToken(user.id, "DEVELOPER");
  const refreshToken = generateRefreshToken(user.id, "DEVELOPER");

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

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const accessToken = generateAccessToken(user.id, "DEVELOPER");
  const refreshToken = generateRefreshToken(user.id, "DEVELOPER");

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
  const decoded = verifyRefreshToken(refreshToken) as { userId: string; role: string };

  const accessToken = generateAccessToken(decoded.userId, decoded.role);
  const newRefreshToken = generateRefreshToken(decoded.userId, decoded.role);

  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
};