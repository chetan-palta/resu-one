import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sparkles, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ATSAnalysisProps {
  resumeData: any;
}

export function ATSAnalysis({ resumeData }: ATSAnalysisProps) {
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<{
    score: number;
    keywords: string[];
    recommendations: string[];
  } | null>(null);
  const { toast } = useToast();

  const analyzeResume = async () => {
    if (!jobDescription.trim()) {
      toast({
        title: "Missing job description",
        description: "Please provide a job description or title to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    // Simulate analysis (will be replaced with real API in Phase 2)
    setTimeout(() => {
      const mockKeywords = [
        "JavaScript",
        "React",
        "TypeScript",
        "Node.js",
        "API",
        "Cloud",
        "Database",
        "Agile",
        "Testing",
        "Git",
      ];

      const mockRecommendations = [
        "Add more quantifiable achievements",
        "Include specific technologies mentioned in the job description",
        "Highlight leadership experience",
        "Add relevant certifications",
        "Optimize formatting for ATS readability",
      ];

      setResults({
        score: Math.floor(Math.random() * 30) + 70, // 70-100
        keywords: mockKeywords,
        recommendations: mockRecommendations,
      });

      setIsAnalyzing(false);
    }, 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-destructive";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    return "Needs Improvement";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          ATS Keyword Analysis
        </CardTitle>
        <CardDescription>
          Analyze your resume against a job description to optimize for Applicant Tracking Systems
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Job Description or Title</label>
          <Textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description or enter the job title you're applying for..."
            className="min-h-32"
            data-testid="input-job-desc"
          />
        </div>

        <Button
          onClick={analyzeResume}
          disabled={isAnalyzing || !jobDescription.trim()}
          className="w-full"
          data-testid="button-analyze"
        >
          {isAnalyzing ? "Analyzing..." : "Analyze Resume"}
        </Button>

        {results && (
          <div className="space-y-6 pt-4 border-t">
            {/* ATS Score */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold" data-testid="text-score-label">ATS Match Score</h3>
                <span className={`text-2xl font-bold ${getScoreColor(results.score)}`} data-testid="text-score-value">
                  {results.score}/100
                </span>
              </div>
              <Progress value={results.score} className="h-3" data-testid="progress-score" />
              <p className="text-sm text-muted-foreground" data-testid="text-score-description">
                {getScoreLabel(results.score)} - Your resume is{" "}
                {results.score >= 80 ? "highly" : results.score >= 60 ? "moderately" : "poorly"}{" "}
                optimized for this position
              </p>
            </div>

            {/* Top Keywords */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                Top 10 Recommended Keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {results.keywords.map((keyword, index) => (
                  <Badge key={index} variant="secondary" data-testid={`keyword-${index}`}>
                    {keyword}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Consider including these keywords in your resume to improve ATS match
              </p>
            </div>

            {/* Recommendations */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Recommendations</h3>
              <ul className="space-y-2">
                {results.recommendations.map((rec, index) => (
                  <li
                    key={index}
                    className="text-sm text-muted-foreground flex items-start gap-2"
                    data-testid={`recommendation-${index}`}
                  >
                    <span className="text-primary mt-0.5">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
