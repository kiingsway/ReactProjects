// utils/apiResponse.ts

import { NextApiResponse } from "next";

export type SuccessResponse<T> = {
  success: true;
  message?: string;
  data?: T;
};

interface ErrorResponse {
  success: false;
  message: string;
  details?: unknown;
};

export function sendSuccess<T>(res: NextApiResponse, data?: T, message?: string, statusCode = 200): void {
  const response: SuccessResponse<T> = { success: true, message, data };
  return res.status(statusCode).json(response);
}

export function sendError(res: NextApiResponse, message: string, statusCode = 500, details?: unknown): void {
  const response: ErrorResponse = { success: false, message, ...(details ? { details } : {}) };
  return res.status(statusCode).json(response);
}
