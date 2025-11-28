import type { Prisma, User, Resume } from '@prisma/client';
import { prisma } from './db';

type InsertUser = Prisma.UserCreateInput;
type InsertResume = Prisma.ResumeUncheckedCreateInput;

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
    return await prisma.user.findUnique({ where: { id } }) ?? undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return await prisma.user.findUnique({ where: { email } }) ?? undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Using Prisma's create input type
    const data: Prisma.UserCreateInput = {
      name: (insertUser as any).name,
      email: (insertUser as any).email,
      password: (insertUser as any).password,
    };
    return await prisma.user.create({ data }) as User;
  }

  async getAllResumesByUserId(userId: string): Promise<Resume[]> {
    const rows = await prisma.resume.findMany({ where: { userId } });
    // If `data` is stored as a JSON string (SQLite), parse it before returning
    return rows.map((r: any) => ({ ...r, data: typeof r.data === 'string' ? JSON.parse(r.data) : r.data })) as Resume[];
  }

  async getResumeById(id: string): Promise<Resume | undefined> {
    const row = await prisma.resume.findUnique({ where: { id } });
    if (!row) return undefined;
    return { ...row, data: typeof row.data === 'string' ? JSON.parse(row.data) : row.data } as Resume;
  }

  async createResume(insertResume: InsertResume): Promise<Resume> {
    // For SQLite schema, `data` may be a string column, so stringify if necessary
    const payload: any = {
      userId: (insertResume as any).userId,
      title: (insertResume as any).title,
      data: (insertResume as any).data,
      template: (insertResume as any).template ?? 'classic',
      font: (insertResume as any).font ?? 'sans',
    };
    const created = await prisma.resume.create({ data: payload });
    return { ...created, data: typeof created.data === 'string' ? JSON.parse(created.data) : created.data } as Resume;
  }

  async updateResume(id: string, resumeUpdate: Partial<InsertResume>): Promise<Resume | undefined> {
    try {
      const updatePayload: any = { ...(resumeUpdate as any) };
      if (updatePayload.data && typeof updatePayload.data === 'string') {
        updatePayload.data = JSON.parse(updatePayload.data);
      }
      const updated = await prisma.resume.update({ where: { id }, data: updatePayload });
      return { ...updated, data: typeof updated.data === 'string' ? JSON.parse(updated.data) : updated.data } as Resume;
    } catch (e) {
      return undefined;
    }
  }

  async deleteResume(id: string): Promise<void> {
    await prisma.resume.deleteMany({ where: { id } });
  }

  async storeRefreshToken(userId: string, token: string, expiresAt: Date): Promise<void> {
    await prisma.refreshToken.create({ data: { userId, token, expiresAt } });
  }

  async validateRefreshToken(token: string): Promise<boolean> {
    const found = await prisma.refreshToken.findFirst({ where: { token, expiresAt: { gt: new Date() } } });
    return !!found;
  }

  async deleteRefreshToken(token: string): Promise<void> {
    await prisma.refreshToken.deleteMany({ where: { token } });
  }

  async deleteAllUserRefreshTokens(userId: string): Promise<void> {
    await prisma.refreshToken.deleteMany({ where: { userId } });
  }
}

export const storage = new DatabaseStorage();
