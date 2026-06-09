import jwt from "jsonwebtoken";
import { env } from "../config/env";

const jwtSecret = env.jwtSecret as string;
const jwtRefreshSecret = env.jwtRefreshSecret as string;

export const generateAccessToken = (userId: string, role: string) => {
  return jwt.sign({ userId, role }, jwtSecret, { expiresIn: "15m" });
};

export const generateRefreshToken = (userId: string, role: string) => {
  return jwt.sign({ userId, role }, jwtRefreshSecret, { expiresIn: "7d" });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, jwtSecret);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, jwtRefreshSecret);
};