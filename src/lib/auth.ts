import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "kernel-os-super-secret-key-2026";

export interface JWTPayload {
  userId: string;
  email: string;
  role: "USER" | "ADMIN";
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export function signJWT(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyJWT(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (err) {
    return null;
  }
}

export function getAuthSession(): JWTPayload | null {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("os_auth_token")?.value;
    if (!token) return null;
    return verifyJWT(token);
  } catch (err) {
    return null;
  }
}
