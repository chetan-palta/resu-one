import { z } from "zod";

// Lightweight shared schemas and types used by both server and client.
// The database models are managed by Prisma (see prisma/schema.prisma).

export const insertUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});

export const insertResumeSchema = z.object({
  userId: z.string(),
  title: z.string(),
  data: z.any(),
  template: z.string().optional(),
  font: z.string().optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertResume = z.infer<typeof insertResumeSchema>;

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string | Date;
};

export type Resume = {
  id: string;
  userId: string;
  title: string;
  data: any;
  template: string;
  font: string;
  createdAt: string | Date;
  updatedAt: string | Date;
};

export const resumeDataSchema = z.object({
  personal: z.object({
    fullName: z.string(),
    email: z.string().email().or(z.literal("")),
    phone: z.string(),
    location: z.string(),
    linkedin: z.string().optional(),
    website: z.string().optional(),
    isFresher: z.boolean().optional(),
    github: z.string().optional(),
    leetcode: z.string().optional(),
    twitter: z.string().optional(),
    customLink: z.string().optional(),
    customLinkLabel: z.string().optional(),
  }),
  summary: z.string().optional(),
  education: z.array(z.object({
    id: z.string(),
    institution: z.string(),
    degree: z.string(),
    field: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    gpa: z.string().optional(), // Keeping for backward compatibility
    scoreType: z.enum(["CGPA", "Percentage", "GPA"]).optional(),
    scoreValue: z.string().optional(),
    scoreScale: z.string().optional(),
    showAs: z.enum(["CGPA", "Percentage"]).optional(),
  })),
  experience: z.array(z.object({
    id: z.string(),
    company: z.string(),
    position: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    current: z.boolean().optional(),
    bullets: z.array(z.string()),
  })).optional(),
  projects: z.array(z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    technologies: z.array(z.string()),
    link: z.string().optional(),
    linkLabel: z.string().optional(),
  })),
  skills: z.array(z.object({
    id: z.string(),
    category: z.string(),
    items: z.array(z.string()),
  })),
  certifications: z.array(z.object({
    id: z.string(),
    name: z.string(),
    issuer: z.string(),
    date: z.string(),
    link: z.string().optional(),
  })),
  languages: z.array(z.object({
    id: z.string(),
    language: z.string(),
    proficiency: z.string(),
  })),
});

export type ResumeData = z.infer<typeof resumeDataSchema>;
