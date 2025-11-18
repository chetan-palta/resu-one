import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { ResumeCard } from "@/components/ResumeCard";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Resume } from "@shared/schema";
import { authenticatedFetch, getCurrentUser, logout, clearTokens } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const user = getCurrentUser();

  const { data: resumes = [], isLoading } = useQuery<Resume[]>({
    queryKey: ["/api/resumes"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await authenticatedFetch(`/api/resumes/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete resume");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/resumes"] });
    },
  });

  const handleEdit = (id: string) => {
    setLocation(`/builder/${id}`);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      await deleteMutation.mutateAsync(deleteId);
      toast({
        title: "Success",
        description: "Resume deleted successfully",
      });
      setDeleteId(null);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete resume",
        variant: "destructive",
      });
    }
  };

  const handleExport = async (id: string, format: "pdf" | "docx") => {
    try {
      const response = await authenticatedFetch(`/api/resumes/${id}/export`, {
        method: "POST",
        body: JSON.stringify({ format }),
      });

      if (!response.ok) throw new Error("Export failed");

      toast({
        title: "Export started",
        description: `Exporting resume as ${format.toUpperCase()}...`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to export resume",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    await logout();
    setLocation("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={handleLogout} />
      
      <main className="container max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Resumes</h1>
            <p className="text-muted-foreground mt-2">
              Create and manage your professional resumes
            </p>
          </div>
          <Button
            onClick={() => setLocation("/builder/new")}
            size="lg"
            data-testid="button-create-resume"
          >
            <Plus className="mr-2 h-5 w-5" />
            Create Resume
          </Button>
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-64 rounded-lg bg-muted animate-pulse"
              />
            ))}
          </div>
        ) : resumes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="flex items-center justify-center h-24 w-24 rounded-full bg-muted mb-6" data-testid="icon-empty-state">
              <FileText className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight mb-2" data-testid="text-empty-title">
              No resumes yet
            </h2>
            <p className="text-muted-foreground text-center max-w-md mb-8" data-testid="text-empty-description">
              Create your first professional resume and start applying for your dream job.
              Our ATS-friendly templates will help you stand out.
            </p>
            <Button
              onClick={() => setLocation("/builder/new")}
              size="lg"
              data-testid="button-create-first-resume"
            >
              <Plus className="mr-2 h-5 w-5" />
              Create Your First Resume
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {resumes.map((resume) => (
              <ResumeCard
                key={resume.id}
                resume={resume}
                onEdit={handleEdit}
                onDelete={(id) => setDeleteId(id)}
                onExport={handleExport}
              />
            ))}
          </div>
        )}
      </main>

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              resume and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
