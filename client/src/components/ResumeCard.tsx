import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, Edit, MoreVertical, Trash2, FileText } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Resume } from "@shared/schema";

interface ResumeCardProps {
  resume: Resume;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onExport: (id: string, format: "pdf" | "docx") => void;
}

export function ResumeCard({ resume, onEdit, onDelete, onExport }: ResumeCardProps) {
  const timeAgo = formatDistanceToNow(new Date(resume.updatedAt), { addSuffix: true });

  return (
    <Card className="group hover-elevate transition-all duration-200" data-testid={`card-resume-${resume.id}`}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
        <div className="flex-1 space-y-1 min-w-0">
          <h3 className="text-lg font-semibold tracking-tight truncate" data-testid={`text-title-${resume.id}`}>
            {resume.title}
          </h3>
          <p className="text-sm text-muted-foreground">
            Updated {timeAgo}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              data-testid={`button-menu-${resume.id}`}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => onEdit(resume.id)}
              data-testid={`menu-edit-${resume.id}`}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onExport(resume.id, "pdf")}
              data-testid={`menu-export-pdf-${resume.id}`}
            >
              <Download className="mr-2 h-4 w-4" />
              Export as PDF
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onExport(resume.id, "docx")}
              data-testid={`menu-export-docx-${resume.id}`}
            >
              <Download className="mr-2 h-4 w-4" />
              Export as DOCX
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(resume.id)}
              className="text-destructive focus:text-destructive"
              data-testid={`menu-delete-${resume.id}`}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent>
        <div className="flex items-center gap-2 p-4 rounded-md bg-muted/30 border">
          <FileText className="h-8 w-8 text-muted-foreground" />
          <div className="flex-1">
            <p className="text-sm font-medium">Resume Preview</p>
            <p className="text-xs text-muted-foreground">
              {resume.template === "classic" ? "Classic Template" : "Modern Template"}
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center gap-2 pt-4">
        <Badge variant="secondary" className="text-xs">
          {resume.template === "classic" ? "Classic" : "Modern"}
        </Badge>
        <Button
          size="sm"
          onClick={() => onEdit(resume.id)}
          className="ml-auto"
          data-testid={`button-edit-${resume.id}`}
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit Resume
        </Button>
      </CardFooter>
    </Card>
  );
}
