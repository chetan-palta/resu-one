import { type User, type InsertUser, type Resume, type InsertResume } from "@shared/schema";
import { db } from "./db";
import { users, resumes, refreshTokens } from "@shared/schema";
import { eq, and, gt } from "drizzle-orm";

export interface IStorage {
  getUserById(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getAllResumesByUserId(userId: string): Promise<Resume[]>;
  getResumeById(id: string): Promise<Resume | undefined>;
  createResume(resume: InsertResume): Promise<Resume>;
  updateResume(id: string, resume: Partial<InsertResume>): Promise<Resume | undefined>;
  deleteResume(id: string): Promise<void>;
  
  storeRefreshToken(userId: string, token: string, expiresAt: Date): Promise<void>;
  validateRefreshToken(token: string): Promise<boolean>;
  deleteRefreshToken(token: string): Promise<void>;
  deleteAllUserRefreshTokens(userId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUserById(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async getAllResumesByUserId(userId: string): Promise<Resume[]> {
    return await db.select().from(resumes).where(eq(resumes.userId, userId));
  }

  async getResumeById(id: string): Promise<Resume | undefined> {
    const result = await db.select().from(resumes).where(eq(resumes.id, id));
    return result[0];
  }

  async createResume(insertResume: InsertResume): Promise<Resume> {
    const result = await db.insert(resumes).values(insertResume).returning();
    return result[0];
  }

  async updateResume(id: string, resumeUpdate: Partial<InsertResume>): Promise<Resume | undefined> {
    const result = await db
      .update(resumes)
      .set({ ...resumeUpdate, updatedAt: new Date() })
      .where(eq(resumes.id, id))
      .returning();
    return result[0];
  }

  async deleteResume(id: string): Promise<void> {
    await db.delete(resumes).where(eq(resumes.id, id));
  }

  async storeRefreshToken(userId: string, token: string, expiresAt: Date): Promise<void> {
    await db.insert(refreshTokens).values({
      userId,
      token,
      expiresAt,
    });
  }

  async validateRefreshToken(token: string): Promise<boolean> {
    const result = await db
      .select()
      .from(refreshTokens)
      .where(and(
        eq(refreshTokens.token, token),
        gt(refreshTokens.expiresAt, new Date())
      ));
    return result.length > 0;
  }

  async deleteRefreshToken(token: string): Promise<void> {
    await db.delete(refreshTokens).where(eq(refreshTokens.token, token));
  }

  async deleteAllUserRefreshTokens(userId: string): Promise<void> {
    await db.delete(refreshTokens).where(eq(refreshTokens.userId, userId));
  }
}

export const storage = new DatabaseStorage();
