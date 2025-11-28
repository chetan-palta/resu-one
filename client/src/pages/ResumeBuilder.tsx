import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Loader2, Save, Download, ArrowLeft, Type } from "lucide-react";
import { FormBuilder } from "@/components/FormBuilder";
import { ClassicTemplate } from "@/components/templates/ClassicTemplate";
import { ModernTemplate } from "@/components/templates/ModernTemplate";
import { MinimalTemplate } from "@/components/templates/MinimalTemplate";
import type { Resume, ResumeData } from "@shared/schema";
import { authenticatedFetch } from "@/lib/api";

const initialData: ResumeData = {
  personal: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    isFresher: false,
  },
  education: [],
  experience: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
};

export default function ResumeBuilder() {
  const [match, params] = useRoute("/builder/:id");
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const isNewResume = params?.id === "new";

  const { data: resume, isLoading } = useQuery<Resume>({
    queryKey: [`/api/resumes/${params?.id}`],
    enabled: !isNewResume,
  });

  const [resumeData, setResumeData] = useState<ResumeData>(initialData);
  const [resumeTitle, setResumeTitle] = useState("Untitled Resume");
  const [template, setTemplate] = useState<"classic" | "modern" | "minimal">("classic");
  const [font, setFont] = useState("sans");
  const [isSaving, setIsSaving] = useState(false);

  // Load initial data when resume is fetched
  useEffect(() => {
    if (resume && !isSaving) {
      setResumeData(resume.data);
      setResumeTitle(resume.title);
      setTemplate(resume.template as "classic" | "modern" | "minimal" || "classic");
      setFont(resume.font || "sans");
    }
  }, [resume, isSaving]);

  // Auto-save to localStorage
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem("draft-resume", JSON.stringify({
        title: resumeTitle,
        data: resumeData,
        template,
        font,
      }));
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [resumeTitle, resumeData, template, font]);

  const handleSave = async () => {
    setIsSaving(true);

    // Basic validation
    const phoneRegex = /^(\+91[\-\s]?|0)?[6-9]\d{9}$/;
    if (resumeData.personal.phone && !phoneRegex.test(resumeData.personal.phone.replace(/\s/g, ''))) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid Indian phone number.",
        variant: "destructive",
      });
      setIsSaving(false);
      return;
    }

    // Score validation
    for (const edu of resumeData.education) {
      if (edu.scoreType === "CGPA") {
        const val = parseFloat(edu.scoreValue || "0");
        const scale = parseFloat(edu.scoreScale || "10");
        if (val < 0 || val > scale) {
          toast({
            title: "Invalid CGPA",
            description: `CGPA must be between 0 and ${scale} for ${edu.institution}`,
            variant: "destructive",
          });
          setIsSaving(false);
          return;
        }
      } else if (edu.scoreType === "Percentage") {
        const val = parseFloat(edu.scoreValue || "0");
        if (val < 0 || val > 100) {
          toast({
            title: "Invalid Percentage",
            description: `Percentage must be between 0 and 100 for ${edu.institution}`,
            variant: "destructive",
          });
          setIsSaving(false);
          return;
        }
      }
    }

    try {
      const url = isNewResume ? "/api/resumes" : `/api/resumes/${params?.id}`;
      const method = isNewResume ? "POST" : "PATCH";

      // Normalize data before sending
      const payload = {
        title: resumeTitle,
        template,
        font,
        data: {
          ...resumeData,
          personal: {
            ...resumeData.personal,
            // Normalize phone to +91 format if valid
            phone: resumeData.personal.phone.replace(/^(\+91|0)?/, "+91").replace(/[\-\s]/g, '')
          },
          // Ensure experience is empty array if fresher (or undefined if schema allows, but let's send empty array for now to be safe with existing UI)
          experience: resumeData.personal.isFresher ? [] : resumeData.experience
        }
      };

      const response = await authenticatedFetch(url, {
        method,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error ? JSON.stringify(errorData.error) : "Failed to save resume");
      }

      const savedResume = await response.json();

      toast({
        title: "Resume saved",
        description: "Your changes have been saved successfully.",
      });

      // Redirect to dashboard or update URL if new
      if (isNewResume) {
        setLocation("/dashboard");
      }
    } catch (error: any) {
      let errorMessage = "Failed to save resume. Please try again.";

      try {
        // Try to parse Zod errors if they are in the error message
        const parsedError = JSON.parse(error.message);
        if (Array.isArray(parsedError)) {
          errorMessage = parsedError.map((e: any) => `${e.path.join('.')}: ${e.message}`).join('\n');
        } else if (parsedError.message) {
          errorMessage = parsedError.message;
        } else if (typeof parsedError === 'string') {
          errorMessage = parsedError;
        }
      } catch (e) {
        // If not JSON, use the original message if it's not the generic one
        if (error.message && error.message !== "Failed to save resume") {
          errorMessage = error.message;
        }
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = async (format: "pdf" | "docx") => {
    try {
      if (isNewResume) {
        toast({
          title: "Save first",
          description: "Please save your resume before exporting.",
          variant: "destructive",
        });
        return;
      }

      const response = await authenticatedFetch(`/api/resumes/${params?.id}/export`, {
        method: "POST",
        body: JSON.stringify({ format, template, font }),
      });

      if (!response.ok) throw new Error("Export failed");

      // Handle file download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Resume_${resumeData.personal.fullName.replace(/\s+/g, '_') || "Untitled"}_${params?.id}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Export complete",
        description: `Your resume has been exported as ${format.toUpperCase()}`,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to export resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/dashboard")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Input
              value={resumeTitle}
              onChange={(e) => setResumeTitle(e.target.value)}
              className="w-64 font-medium"
              placeholder="Resume Title"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select value={template} onValueChange={(v) => setTemplate(v as any)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Template" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="classic">Classic</SelectItem>
              <SelectItem value="modern">Modern</SelectItem>
              <SelectItem value="minimal">Minimal (One Page)</SelectItem>
            </SelectContent>
          </Select>

          <Select value={font} onValueChange={setFont}>
            <SelectTrigger className="w-[140px]">
              <Type className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Font" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sans">Sans Serif</SelectItem>
              <SelectItem value="serif">Serif</SelectItem>
              <SelectItem value="mono">Monospace</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={() => handleSave()} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>

          <div className="flex gap-1">
            <Button variant="default" onClick={() => handleExport("pdf")}>
              <Download className="h-4 w-4 mr-2" />
              PDF
            </Button>
            <Button variant="secondary" onClick={() => handleExport("docx")}>
              <Download className="h-4 w-4 mr-2" />
              DOCX
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Form */}
        <div className="w-1/2 border-r bg-muted/10 overflow-y-auto p-6">
          <FormBuilder data={resumeData} onChange={setResumeData} />
        </div>

        {/* Right Panel - Preview */}
        <div className="w-1/2 bg-muted/30 overflow-y-auto p-8">
          <div className="max-w-[210mm] mx-auto shadow-lg min-h-[297mm] bg-white origin-top transform scale-90">
            {template === "classic" && <ClassicTemplate data={resumeData} />}
            {template === "modern" && <ModernTemplate data={resumeData} />}
            {template === "minimal" && <MinimalTemplate data={resumeData} font={font} />}
          </div>
        </div>
      </div>
    </div>
  );
}
