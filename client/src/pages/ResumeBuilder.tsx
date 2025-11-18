import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { Header } from "@/components/Header";
import { FormBuilder } from "@/components/FormBuilder";
import { ClassicTemplate } from "@/components/templates/ClassicTemplate";
import { ModernTemplate } from "@/components/templates/ModernTemplate";
import { ExportModal } from "@/components/ExportModal";
import { ATSAnalysis } from "@/components/ATSAnalysis";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Download, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { ResumeData } from "@shared/schema";

const initialData: ResumeData = {
  personal: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    website: "",
  },
  summary: "",
  education: [],
  experience: [],
  projects: [],
  skills: [],
  certifications: [],
  languages: [],
};

export default function ResumeBuilder() {
  const [, params] = useRoute("/builder/:id");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [resumeTitle, setResumeTitle] = useState("Untitled Resume");
  const [resumeData, setResumeData] = useState<ResumeData>(initialData);
  const [template, setTemplate] = useState<"classic" | "modern">("classic");
  const [showPreview, setShowPreview] = useState(true);
  const [showExportModal, setShowExportModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Temporary mock user (will be replaced with auth in Phase 2)
  const user = { name: "John Doe", email: "john@example.com" };

  const isNewResume = params?.id === "new";

  // Load resume data (Phase 3 will add real API call)
  useEffect(() => {
    if (!isNewResume) {
      // TODO: Load existing resume from API
    }
  }, [params?.id, isNewResume]);

  // Auto-save to localStorage
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem("draft-resume", JSON.stringify({
        title: resumeTitle,
        data: resumeData,
        template,
      }));
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [resumeTitle, resumeData, template]);

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // TODO: API call will be implemented in Phase 2
      toast({
        title: "Resume saved",
        description: "Your changes have been saved successfully.",
      });
      
      setTimeout(() => {
        setLocation("/dashboard");
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = async (format: "pdf" | "docx") => {
    try {
      // TODO: API call will be implemented in Phase 2
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: "Export complete",
        description: `Your resume has been exported as ${format.toUpperCase()}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    setLocation("/login");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header user={user} onLogout={handleLogout} />

      {/* Top Toolbar */}
      <div className="border-b bg-background sticky top-16 z-40">
        <div className="container max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 max-w-md">
              <Input
                value={resumeTitle}
                onChange={(e) => setResumeTitle(e.target.value)}
                placeholder="Resume Title"
                className="font-semibold"
                data-testid="input-resume-title"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
                className="hidden lg:flex"
                data-testid="button-toggle-preview"
              >
                {showPreview ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                {showPreview ? "Hide" : "Show"} Preview
              </Button>

              <Select value={template} onValueChange={(v) => setTemplate(v as "classic" | "modern")}>
                <SelectTrigger className="w-40" data-testid="select-template">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="classic" data-testid="option-template-classic">Classic</SelectItem>
                  <SelectItem value="modern" data-testid="option-template-modern">Modern</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowExportModal(true)}
                data-testid="button-export"
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>

              <Button
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
                data-testid="button-save"
              >
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full container max-w-7xl mx-auto px-4 py-6">
          <div className="grid lg:grid-cols-[1fr,600px] gap-6 h-full">
            {/* Left Panel - Form */}
            <div className="h-full overflow-hidden">
              <FormBuilder data={resumeData} onChange={setResumeData} />
            </div>

            {/* Right Panel - Preview & ATS */}
            {showPreview && (
              <div className="hidden lg:block h-full overflow-y-auto" data-testid="panel-preview">
                <Tabs defaultValue="preview" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="preview" data-testid="tab-preview">Preview</TabsTrigger>
                    <TabsTrigger value="ats" data-testid="tab-ats">ATS Analysis</TabsTrigger>
                  </TabsList>

                  <TabsContent value="preview" className="mt-0" data-testid="content-preview">
                    <div className="bg-muted/30 p-6 rounded-lg">
                      <div className="bg-white shadow-lg mx-auto" style={{ width: "8.5in", transform: "scale(0.7)", transformOrigin: "top center" }} data-testid="resume-preview">
                        {template === "classic" ? (
                          <ClassicTemplate data={resumeData} />
                        ) : (
                          <ModernTemplate data={resumeData} />
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="ats" className="mt-0" data-testid="content-ats">
                    <ATSAnalysis resumeData={resumeData} />
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        </div>
      </div>

      <ExportModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        resumeId={params?.id || "new"}
        onExport={handleExport}
      />
    </div>
  );
}
