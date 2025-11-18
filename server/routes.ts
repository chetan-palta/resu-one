import type { Express } from "express";
import { createServer, type Server } from "http";
import express from "express";
import { storage } from "./storage";
import { hashPassword, comparePassword, generateAccessToken, generateRefreshToken, verifyRefreshToken } from "./auth";
import { authMiddleware, type AuthRequest } from "./middleware";
import { insertUserSchema, insertResumeSchema, resumeDataSchema } from "@shared/schema";
import { z } from "zod";
import rateLimit from "express-rate-limit";

const exportLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many export requests, please try again later",
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many authentication attempts, please try again later",
});

const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many refresh requests, please try again later",
});

export async function registerRoutes(app: Express): Promise<Server> {
  app.use(express.json());

  app.post("/api/auth/register", authLimiter, async (req, res) => {
    try {
      const registerSchema = insertUserSchema.extend({
        password: z.string().min(6),
      });

      const { name, email, password } = registerSchema.parse(req.body);

      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "Email already registered" });
      }

      const hashedPassword = await hashPassword(password);
      const user = await storage.createUser({
        name,
        email,
        password: hashedPassword,
      });

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
      
      const refreshTokenExpiry = new Date();
      refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7);
      await storage.storeRefreshToken(user.id, refreshToken, refreshTokenExpiry);

      return res.status(201).json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        accessToken,
        refreshToken,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/auth/login", authLimiter, async (req, res) => {
    try {
      const loginSchema = z.object({
        email: z.string().email(),
        password: z.string(),
      });

      const { email, password } = loginSchema.parse(req.body);

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isValidPassword = await comparePassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
      
      const refreshTokenExpiry = new Date();
      refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7);
      await storage.storeRefreshToken(user.id, refreshToken, refreshTokenExpiry);

      return res.status(200).json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        accessToken,
        refreshToken,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/auth/refresh", refreshLimiter, async (req, res) => {
    try {
      const { refreshToken } = z.object({ refreshToken: z.string() }).parse(req.body);

      const payload = verifyRefreshToken(refreshToken);
      if (!payload) {
        return res.status(401).json({ error: "Invalid refresh token" });
      }

      const isValid = await storage.validateRefreshToken(refreshToken);
      if (!isValid) {
        return res.status(401).json({ error: "Refresh token has been revoked or expired" });
      }

      const user = await storage.getUserById(payload.userId);
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      await storage.deleteRefreshToken(refreshToken);

      const newAccessToken = generateAccessToken(user);
      const newRefreshToken = generateRefreshToken(user);
      
      const refreshTokenExpiry = new Date();
      refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7);
      await storage.storeRefreshToken(user.id, newRefreshToken, refreshTokenExpiry);

      return res.status(200).json({ 
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      });
    } catch (error) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }
  });

  app.post("/api/auth/logout", authMiddleware, async (req: AuthRequest, res) => {
    try {
      await storage.deleteAllUserRefreshTokens(req.userId!);
      return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/resumes", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const resumes = await storage.getAllResumesByUserId(req.userId!);
      return res.status(200).json(resumes);
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/resumes/:id", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const resume = await storage.getResumeById(req.params.id);

      if (!resume || resume.userId !== req.userId) {
        return res.status(404).json({ error: "Resume not found" });
      }

      return res.status(200).json(resume);
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/resumes", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const createResumeSchema = z.object({
        title: z.string().min(1),
        data: resumeDataSchema,
        template: z.enum(["classic", "modern"]).default("classic"),
      });

      const validated = createResumeSchema.parse(req.body);

      const resume = await storage.createResume({
        userId: req.userId!,
        title: validated.title,
        data: validated.data,
        template: validated.template,
      });

      return res.status(201).json(resume);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.patch("/api/resumes/:id", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const resume = await storage.getResumeById(req.params.id);

      if (!resume || resume.userId !== req.userId) {
        return res.status(404).json({ error: "Resume not found" });
      }

      const updateResumeSchema = z.object({
        title: z.string().min(1).optional(),
        data: resumeDataSchema.optional(),
        template: z.enum(["classic", "modern"]).optional(),
      });

      const validated = updateResumeSchema.parse(req.body);
      const updatedResume = await storage.updateResume(req.params.id, validated);

      return res.status(200).json(updatedResume);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/resumes/:id", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const resume = await storage.getResumeById(req.params.id);

      if (!resume || resume.userId !== req.userId) {
        return res.status(404).json({ error: "Resume not found" });
      }

      await storage.deleteResume(req.params.id);
      return res.status(200).json({ message: "Resume deleted successfully" });
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/resumes/:id/export", exportLimiter, authMiddleware, async (req: AuthRequest, res) => {
    try {
      const resume = await storage.getResumeById(req.params.id);

      if (!resume || resume.userId !== req.userId) {
        return res.status(404).json({ error: "Resume not found" });
      }

      const { format } = z.object({ format: z.enum(["pdf", "docx"]) }).parse(req.body);

      return res.status(200).json({ 
        message: `Export to ${format} will be implemented with Puppeteer/DOCX libraries`,
        resumeId: resume.id,
        format 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/ats/analyze", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const analyzeSchema = z.object({
        jobTitle: z.string(),
        jobDescription: z.string(),
        resumeData: resumeDataSchema,
      });

      const { jobTitle, jobDescription, resumeData } = analyzeSchema.parse(req.body);

      const keywords = extractKeywords(jobDescription);
      const score = calculateATSScore(resumeData, keywords, jobDescription);
      const matches = findMatchingKeywords(resumeData, keywords);
      const missing = keywords.filter(k => !matches.includes(k));

      return res.status(200).json({
        score,
        matches,
        missing,
        suggestions: generateSuggestions(score, missing),
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

function extractKeywords(text: string): string[] {
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'be', 'been', 'being']);
  
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word));

  const wordFreq = new Map<string, number>();
  words.forEach(word => {
    wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
  });

  return Array.from(wordFreq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([word]) => word);
}

function findMatchingKeywords(resumeData: any, keywords: string[]): string[] {
  const resumeText = JSON.stringify(resumeData).toLowerCase();
  return keywords.filter(keyword => resumeText.includes(keyword.toLowerCase()));
}

function calculateATSScore(resumeData: any, keywords: string[], jobDescription: string): number {
  const matches = findMatchingKeywords(resumeData, keywords);
  const keywordScore = (matches.length / keywords.length) * 50;
  
  let structureScore = 0;
  if (resumeData.summary) structureScore += 10;
  if (resumeData.experience.length > 0) structureScore += 15;
  if (resumeData.education.length > 0) structureScore += 10;
  if (resumeData.skills.length > 0) structureScore += 10;
  if (resumeData.projects.length > 0) structureScore += 5;

  return Math.min(100, Math.round(keywordScore + structureScore));
}

function generateSuggestions(score: number, missingKeywords: string[]): string[] {
  const suggestions: string[] = [];

  if (score < 60) {
    suggestions.push("Add more relevant keywords from the job description");
  }

  if (missingKeywords.length > 0) {
    suggestions.push(`Consider adding these keywords: ${missingKeywords.slice(0, 5).join(", ")}`);
  }

  if (score < 80) {
    suggestions.push("Ensure all sections (summary, experience, education, skills) are filled out");
  }

  return suggestions;
}
