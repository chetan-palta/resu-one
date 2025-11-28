import type { Express } from "express";
import { createServer, type Server } from "http";
import express, { type Request, type Response, type NextFunction } from "express";
import { storage } from "./storage";
import { hashPassword, comparePassword, generateAccessToken, generateRefreshToken, verifyRefreshToken } from "./auth";
import { authMiddleware, type AuthRequest } from "./middleware";
import { insertUserSchema, insertResumeSchema, resumeDataSchema } from "@shared/schema";
import { z } from "zod";
import puppeteer from "puppeteer";
import { Document, Packer, Paragraph, TextRun } from "docx";
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
        // storage expects `data` as string for SQLite; stringify here so types align
        data: validated.data,
        template: validated.template,
      });

      return res.status(201).json(resume);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating resume:", error);
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
      // ensure `data` is stringified for storage when provided
      const toUpdate: any = { ...validated };
      if (toUpdate.data) toUpdate.data = validated.data;
      const updatedResume = await storage.updateResume(req.params.id, toUpdate);

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

      const { format, template, font } = z.object({
        format: z.enum(["pdf", "docx"]),
        template: z.string().optional(),
        font: z.string().optional()
      }).parse(req.body);

      if (format === "pdf") {
        // Launch puppeteer
        const browser = await puppeteer.launch({
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();

        // We need to render the resume. Ideally we'd use the same React components.
        // For MVP, we can navigate to the preview page if we can authenticate,
        // or we can construct a simple HTML representation here.
        // Since we can't easily share React components with Node without SSR setup,
        // we will use a trick: we'll inject the data into a template string that mimics the React template.
        // OR, we can use the client to generate the HTML and send it? No, security.
        // Let's try to navigate to the client-side preview URL.
        // Assuming the client is running on localhost:5173 (Vite dev) or served statically.
        // But we need to pass the data.
        // Let's construct a minimal HTML page with the data injected.

        const resumeData = resume.data as any;

        const htmlContent = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8">
              <title>${resume.title}</title>
              <script src="https://cdn.tailwindcss.com"></script>
              <style>
                @page { margin: 0; size: A4; }
                body { margin: 0; padding: 0; -webkit-print-color-adjust: exact; }
                .font-sans { font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; }
                .font-serif { font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif; }
                .font-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
              </style>
            </head>
            <body class="font-${font || 'sans'} p-8 max-w-[210mm] mx-auto">
              <h1 class="text-3xl font-bold uppercase mb-2">${resumeData.personal.fullName}</h1>
              <div class="text-sm text-gray-600 mb-6">
                ${resumeData.personal.email} | ${resumeData.personal.phone} | ${resumeData.personal.location}
              </div>

              <!-- Summary -->
              ${resumeData.summary ? `
                <div class="mb-6">
                  <h2 class="text-sm font-bold uppercase border-b mb-2">Summary</h2>
                  <p class="text-sm">${resumeData.summary}</p>
                </div>
              ` : ''}

              <!-- Experience -->
              ${resumeData.experience?.length ? `
                <div class="mb-6">
                  <h2 class="text-sm font-bold uppercase border-b mb-2">Experience</h2>
                  ${resumeData.experience.map((exp: any) => `
                    <div class="mb-4">
                      <div class="flex justify-between font-bold text-sm">
                        <span>${exp.position}</span>
                        <span>${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}</span>
                      </div>
                      <div class="text-sm text-gray-600 mb-1">${exp.company}</div>
                      <ul class="list-disc ml-4 text-sm">
                        ${exp.bullets.map((b: string) => `<li>${b}</li>`).join('')}
                      </ul>
                    </div>
                  `).join('')}
                </div>
              ` : ''}

              <!-- Education -->
              ${resumeData.education?.length ? `
                <div class="mb-6">
                  <h2 class="text-sm font-bold uppercase border-b mb-2">Education</h2>
                  ${resumeData.education.map((edu: any) => `
                    <div class="mb-2">
                      <div class="flex justify-between font-bold text-sm">
                        <span>${edu.institution}</span>
                        <span>${edu.startDate} - ${edu.endDate}</span>
                      </div>
                      <div class="text-sm">${edu.degree} in ${edu.field}</div>
                      ${edu.scoreValue ? `<div class="text-xs text-gray-600">${edu.showAs === 'Percentage' && edu.scoreScale ? `Approx: ${((parseFloat(edu.scoreValue) / parseFloat(edu.scoreScale)) * 100).toFixed(2)}%` : `${edu.scoreType} ${edu.scoreValue}/${edu.scoreScale}`}</div>` : ''}
                    </div>
                  `).join('')}
                </div>
              ` : ''}

              <!-- Skills -->
              ${resumeData.skills?.length ? `
                <div class="mb-6">
                  <h2 class="text-sm font-bold uppercase border-b mb-2">Skills</h2>
                  <div class="text-sm">
                    ${resumeData.skills.map((s: any) => `
                      <div class="mb-1"><span class="font-bold">${s.category}:</span> ${s.items.join(', ')}</div>
                    `).join('')}
                  </div>
                </div>
              ` : ''}

            </body>
          </html>
        `;

        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
        await browser.close();

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="Resume_${resume.title.replace(/\s+/g, '_')}.pdf"`);
        return res.send(pdfBuffer);

      } else {
        // DOCX generation using docx library
        // This is a simplified version. In a real app, we'd map all fields.
        const resumeData = resume.data as any;
        const doc = new Document({
          sections: [{
            properties: {},
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: resumeData.personal.fullName,
                    bold: true,
                    size: 32,
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${resumeData.personal.email} | ${resumeData.personal.phone}`,
                    size: 24,
                  }),
                ],
              }),
              // Add more sections as needed...
            ],
          }],
        });

        const buffer = await Packer.toBuffer(doc);
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
        res.setHeader("Content-Disposition", `attachment; filename="Resume_${resume.title.replace(/\s+/g, '_')}.docx"`);
        return res.send(buffer);
      }
    } catch (error) {
      console.error(error);
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
