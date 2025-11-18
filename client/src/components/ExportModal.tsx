import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Download, FileText, CheckCircle2 } from "lucide-react";

interface ExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resumeId: string;
  onExport: (format: "pdf" | "docx") => Promise<void>;
}

export function ExportModal({ open, onOpenChange, resumeId, onExport }: ExportModalProps) {
  const [format, setFormat] = useState<"pdf" | "docx">("pdf");
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    setProgress(0);
    setIsComplete(false);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      await onExport(format);
      clearInterval(interval);
      setProgress(100);
      setIsComplete(true);
      
      setTimeout(() => {
        onOpenChange(false);
        setIsExporting(false);
        setProgress(0);
        setIsComplete(false);
      }, 2000);
    } catch (error) {
      clearInterval(interval);
      setIsExporting(false);
      setProgress(0);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Export Resume
          </DialogTitle>
          <DialogDescription>
            Choose your preferred format to download your resume
          </DialogDescription>
        </DialogHeader>

        {!isExporting && !isComplete && (
          <div className="space-y-6">
            <RadioGroup value={format} onValueChange={(v) => setFormat(v as "pdf" | "docx")}>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 rounded-lg border p-4 hover-elevate cursor-pointer">
                  <RadioGroupItem value="pdf" id="pdf" data-testid="radio-pdf" />
                  <Label htmlFor="pdf" className="flex-1 cursor-pointer">
                    <div className="font-semibold">PDF Document</div>
                    <div className="text-sm text-muted-foreground">
                      Best for printing and email attachments
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 rounded-lg border p-4 hover-elevate cursor-pointer">
                  <RadioGroupItem value="docx" id="docx" data-testid="radio-docx" />
                  <Label htmlFor="docx" className="flex-1 cursor-pointer">
                    <div className="font-semibold">Word Document (.docx)</div>
                    <div className="text-sm text-muted-foreground">
                      Editable format compatible with Microsoft Word
                    </div>
                  </Label>
                </div>
              </div>
            </RadioGroup>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
                data-testid="button-cancel-export"
              >
                Cancel
              </Button>
              <Button
                onClick={handleExport}
                className="flex-1"
                data-testid="button-export"
              >
                <Download className="mr-2 h-4 w-4" />
                Export as {format.toUpperCase()}
              </Button>
            </div>
          </div>
        )}

        {isExporting && !isComplete && (
          <div className="space-y-4 py-4">
            <div className="text-center">
              <p className="text-sm font-medium mb-4">Generating your {format.toUpperCase()} file...</p>
              <Progress value={progress} className="w-full" />
              <p className="text-xs text-muted-foreground mt-2">{progress}% complete</p>
            </div>
          </div>
        )}

        {isComplete && (
          <div className="space-y-4 py-6 text-center">
            <div className="flex justify-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">Export Complete!</h3>
              <p className="text-sm text-muted-foreground">
                Your resume has been successfully exported
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
