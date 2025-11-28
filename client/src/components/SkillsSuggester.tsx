import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

// Local map of related skills
const SKILL_MAP: Record<string, string[]> = {
    react: ["Redux", "Next.js", "TypeScript", "Tailwind CSS", "Vite", "React Query"],
    javascript: ["TypeScript", "Node.js", "React", "Vue.js", "ES6+"],
    typescript: ["React", "Angular", "Node.js", "NestJS"],
    node: ["Express", "MongoDB", "PostgreSQL", "NestJS", "Docker"],
    python: ["Django", "Flask", "FastAPI", "Pandas", "NumPy", "Machine Learning"],
    java: ["Spring Boot", "Hibernate", "Microservices", "Kotlin"],
    html: ["CSS", "JavaScript", "Responsive Design", "Accessibility"],
    css: ["Sass", "Tailwind CSS", "Bootstrap", "Flexbox", "Grid"],
    sql: ["PostgreSQL", "MySQL", "Database Design", "ORM"],
    git: ["GitHub", "GitLab", "CI/CD", "Version Control"],
    aws: ["Docker", "Kubernetes", "Cloud Computing", "Serverless"],
    docker: ["Kubernetes", "CI/CD", "DevOps", "AWS"],
};

interface SkillsSuggesterProps {
    currentSkills: string[];
    onAddSkill: (skill: string) => void;
}

export function SkillsSuggester({ currentSkills, onAddSkill }: SkillsSuggesterProps) {
    const [suggestions, setSuggestions] = useState<string[]>([]);

    useEffect(() => {
        // Debounce logic could be here, but for local map it's fast enough
        const newSuggestions = new Set<string>();

        // Always show some default popular skills if empty
        if (currentSkills.length === 0) {
            ["JavaScript", "Python", "React", "Node.js", "SQL", "Git"].forEach(s => newSuggestions.add(s));
        }

        currentSkills.forEach(skill => {
            const normalized = skill.toLowerCase().trim();
            // Direct matches
            if (SKILL_MAP[normalized]) {
                SKILL_MAP[normalized].forEach(s => newSuggestions.add(s));
            }
            // Partial matches (simple)
            Object.keys(SKILL_MAP).forEach(key => {
                if (key.includes(normalized) || normalized.includes(key)) {
                    SKILL_MAP[key].forEach(s => newSuggestions.add(s));
                }
            });
        });

        // Filter out already added skills
        const filtered = Array.from(newSuggestions).filter(
            s => !currentSkills.some(cs => cs.toLowerCase() === s.toLowerCase())
        );

        setSuggestions(filtered.slice(0, 10)); // Limit to 10 suggestions
    }, [currentSkills]);

    if (suggestions.length === 0) return null;

    return (
        <div className="mt-2">
            <p className="text-xs text-muted-foreground mb-2">Suggested skills:</p>
            <div className="flex flex-wrap gap-2">
                {suggestions.map((skill) => (
                    <Badge
                        key={skill}
                        variant="outline"
                        className="cursor-pointer hover:bg-secondary transition-colors"
                        onClick={() => onAddSkill(skill)}
                    >
                        <Plus className="w-3 h-3 mr-1" />
                        {skill}
                    </Badge>
                ))}
            </div>
        </div>
    );
}
