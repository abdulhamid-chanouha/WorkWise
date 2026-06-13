import { Request, Response } from "express";
import {
  loginUser,
  refreshUserToken,
  registerUser,
  requestPasswordReset,
  resetPassword,
} from "../services/auth.service";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    const result = await registerUser(name, email, password);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Registration failed",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const result = await loginUser(email, password);

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: result,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error instanceof Error ? error.message : "Login failed",
    });
  }
};

export const logout = async (_req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token is required",
      });
    }

    const result = await refreshUserToken(refreshToken);

    return res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      data: result,
    });
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid refresh token",
    });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  const email = String(req.body.email || "").trim();

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  try {
    await requestPasswordReset(email);
    return res.status(200).json({
      success: true,
      message: "If an account exists for that email, a reset link has been sent.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message === "MAIL_NOT_CONFIGURED") {
      return res.status(503).json({ success: false, message: "Email delivery is not configured yet" });
    }
    return res.status(502).json({ success: false, message: "Unable to send the reset email" });
  }
};

export const updatePassword = async (req: Request, res: Response) => {
  const token = String(req.body.token || "").trim();
  const password = String(req.body.password || "");

  if (!token || password.length < 8) {
    return res.status(400).json({
      success: false,
      message: "A valid reset token and password of at least 8 characters are required",
    });
  }

  try {
    await resetPassword(token, password);
    return res.status(200).json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    if (error instanceof Error && error.message === "INVALID_OR_EXPIRED_RESET_TOKEN") {
      return res.status(400).json({ success: false, message: "This reset link is invalid or has expired" });
    }
    return res.status(500).json({ success: false, message: "Unable to reset password" });
  }
};
