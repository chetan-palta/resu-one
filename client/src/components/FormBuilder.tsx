import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, Info } from "lucide-react";
import { SkillsSuggester } from "./SkillsSuggester";
import type { ResumeData } from "@shared/schema";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormBuilderProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

export function FormBuilder({ data, onChange }: FormBuilderProps) {
  const [openSection, setOpenSection] = useState<string>("personal");

  const updatePersonal = (field: string, value: string | boolean) => {
    onChange({
      ...data,
      personal: { ...data.personal, [field]: value },
    });
  };

  const addEducation = () => {
    onChange({
      ...data,
      education: [
        ...data.education,
        {
          id: crypto.randomUUID(),
          institution: "",
          degree: "",
          field: "",
          startDate: "",
          endDate: "",
          gpa: "",
        },
      ],
    });
  };

  const updateEducation = (id: string, field: string, value: string) => {
    onChange({
      ...data,
      education: data.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    });
  };

  const removeEducation = (id: string) => {
    onChange({
      ...data,
      education: data.education.filter((edu) => edu.id !== id),
    });
  };

  const addExperience = () => {
    onChange({
      ...data,
      experience: [
        ...(data.experience || []),
        {
          id: crypto.randomUUID(),
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          current: false,
          bullets: [""],
        },
      ],
    });
  };

  const updateExperience = (id: string, field: string, value: any) => {
    onChange({
      ...data,
      experience: data.experience?.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ) || [],
    });
  };

  const removeExperience = (id: string) => {
    onChange({
      ...data,
      experience: data.experience?.filter((exp) => exp.id !== id) || [],
    });
  };

  const addBullet = (expId: string) => {
    onChange({
      ...data,
      experience: data.experience?.map((exp) =>
        exp.id === expId ? { ...exp, bullets: [...exp.bullets, ""] } : exp
      ) || [],
    });
  };

  const updateBullet = (expId: string, index: number, value: string) => {
    onChange({
      ...data,
      experience: data.experience?.map((exp) =>
        exp.id === expId
          ? {
            ...exp,
            bullets: exp.bullets.map((b, i) => (i === index ? value : b)),
          }
          : exp
      ) || [],
    });
  };

  const removeBullet = (expId: string, index: number) => {
    onChange({
      ...data,
      experience: data.experience?.map((exp) =>
        exp.id === expId
          ? { ...exp, bullets: exp.bullets.filter((_, i) => i !== index) }
          : exp
      ) || [],
    });
  };

  const addProject = () => {
    onChange({
      ...data,
      projects: [
        ...data.projects,
        {
          id: crypto.randomUUID(),
          name: "",
          description: "",
          technologies: [],
          link: "",
        },
      ],
    });
  };

  const updateProject = (id: string, field: string, value: any) => {
    onChange({
      ...data,
      projects: data.projects.map((proj) =>
        proj.id === id ? { ...proj, [field]: value } : proj
      ),
    });
  };

  const removeProject = (id: string) => {
    onChange({
      ...data,
      projects: data.projects.filter((proj) => proj.id !== id),
    });
  };

  const addSkillGroup = () => {
    onChange({
      ...data,
      skills: [
        ...data.skills,
        {
          id: crypto.randomUUID(),
          category: "",
          items: [],
        },
      ],
    });
  };

  const updateSkillGroup = (id: string, field: string, value: any) => {
    onChange({
      ...data,
      skills: data.skills.map((skill) =>
        skill.id === id ? { ...skill, [field]: value } : skill
      ),
    });
  };

  const removeSkillGroup = (id: string) => {
    onChange({
      ...data,
      skills: data.skills.filter((skill) => skill.id !== id),
    });
  };

  const addCertification = () => {
    onChange({
      ...data,
      certifications: [
        ...data.certifications,
        {
          id: crypto.randomUUID(),
          name: "",
          issuer: "",
          date: "",
          link: "",
        },
      ],
    });
  };

  const updateCertification = (id: string, field: string, value: string) => {
    onChange({
      ...data,
      certifications: data.certifications.map((cert) =>
        cert.id === id ? { ...cert, [field]: value } : cert
      ),
    });
  };

  const removeCertification = (id: string) => {
    onChange({
      ...data,
      certifications: data.certifications.filter((cert) => cert.id !== id),
    });
  };

  const addLanguage = () => {
    onChange({
      ...data,
      languages: [
        ...data.languages,
        {
          id: crypto.randomUUID(),
          language: "",
          proficiency: "",
        },
      ],
    });
  };

  const updateLanguage = (id: string, field: string, value: string) => {
    onChange({
      ...data,
      languages: data.languages.map((lang) =>
        lang.id === id ? { ...lang, [field]: value } : lang
      ),
    });
  };

  const removeLanguage = (id: string) => {
    onChange({
      ...data,
      languages: data.languages.filter((lang) => lang.id !== id),
    });
  };

  return (
    <div className="h-full overflow-y-auto">
      <Accordion
        type="single"
        collapsible
        value={openSection}
        onValueChange={setOpenSection}
        className="space-y-4"
      >
        {/* Personal Information */}
        <AccordionItem value="personal" className="border rounded-lg px-6">
          <AccordionTrigger className="hover:no-underline py-4" data-testid="accordion-personal">
            <span className="text-lg font-semibold">Personal Information</span>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pb-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={data.personal.fullName}
                  onChange={(e) => updatePersonal("fullName", e.target.value)}
                  placeholder="Enter your name"
                  data-testid="input-fullname"
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={data.personal.email}
                  onChange={(e) => updatePersonal("email", e.target.value)}
                  placeholder="john@example.com"
                  data-testid="input-email"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  value={data.personal.phone}
                  onChange={(e) => updatePersonal("phone", e.target.value)}
                  placeholder="Ex: +91 9123456789 or 9123456789"
                  data-testid="input-phone"
                />
              </div>
              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={data.personal.location}
                  onChange={(e) => updatePersonal("location", e.target.value)}
                  placeholder="Chandigarh, India"
                  data-testid="input-location"
                />
              </div>
              <div className="col-span-2 flex items-center space-x-2">
                <Checkbox
                  id="isFresher"
                  checked={data.personal.isFresher}
                  onCheckedChange={(checked) =>
                    updatePersonal("isFresher", checked as boolean)
                  }
                />
                <Label htmlFor="isFresher" className="font-normal cursor-pointer">
                  Fresher / Currently a student (No work experience)
                </Label>
              </div>
              <div>
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  value={data.personal.linkedin || ""}
                  onChange={(e) => updatePersonal("linkedin", e.target.value)}
                  placeholder="linkedin.com/in/johndoe"
                  data-testid="input-linkedin"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={data.personal.website || ""}
                  onChange={(e) => updatePersonal("website", e.target.value)}
                  placeholder="johndoe.com"
                  data-testid="input-website"
                />
              </div>
              <div>
                <Label htmlFor="github">GitHub</Label>
                <Input
                  id="github"
                  value={data.personal.github || ""}
                  onChange={(e) => updatePersonal("github", e.target.value)}
                  placeholder="github.com/johndoe"
                  data-testid="input-github"
                />
              </div>
              <div>
                <Label htmlFor="leetcode">LeetCode</Label>
                <Input
                  id="leetcode"
                  value={data.personal.leetcode || ""}
                  onChange={(e) => updatePersonal("leetcode", e.target.value)}
                  placeholder="leetcode.com/johndoe"
                  data-testid="input-leetcode"
                />
              </div>
              <div>
                <Label htmlFor="twitter">Twitter / X</Label>
                <Input
                  id="twitter"
                  value={data.personal.twitter || ""}
                  onChange={(e) => updatePersonal("twitter", e.target.value)}
                  placeholder="twitter.com/johndoe"
                  data-testid="input-twitter"
                />
              </div>
              <div className="grid grid-cols-2 gap-2 col-span-2">
                <div>
                  <Label htmlFor="customLinkLabel">Custom Link Label</Label>
                  <Input
                    id="customLinkLabel"
                    value={data.personal.customLinkLabel || ""}
                    onChange={(e) => updatePersonal("customLinkLabel", e.target.value)}
                    placeholder="Portfolio / Blog"
                  />
                </div>
                <div>
                  <Label htmlFor="customLink">Custom Link URL</Label>
                  <Input
                    id="customLink"
                    value={data.personal.customLink || ""}
                    onChange={(e) => updatePersonal("customLink", e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Summary */}
        <AccordionItem value="summary" className="border rounded-lg px-6">
          <AccordionTrigger className="hover:no-underline py-4" data-testid="accordion-summary">
            <span className="text-lg font-semibold">Professional Summary</span>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pb-6">
            <div>
              <Label htmlFor="summary">Summary</Label>
              <Textarea
                id="summary"
                value={data.summary || ""}
                onChange={(e) => onChange({ ...data, summary: e.target.value })}
                placeholder="Brief overview of your professional background and key achievements..."
                className="min-h-32"
                data-testid="input-summary"
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Education */}
        <AccordionItem value="education" className="border rounded-lg px-6">
          <AccordionTrigger className="hover:no-underline py-4" data-testid="accordion-education">
            <span className="text-lg font-semibold">Education</span>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pb-6">
            {data.education.map((edu, index) => (
              <Card key={edu.id} className="p-4 relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8"
                  onClick={() => removeEducation(edu.id)}
                  data-testid={`button-remove-education-${index}`}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
                <div className="space-y-4 pr-10">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label>Institution *</Label>
                      <Input
                        value={edu.institution}
                        onChange={(e) =>
                          updateEducation(edu.id, "institution", e.target.value)
                        }
                        placeholder="University of Example"
                        data-testid={`input-institution-${index}`}
                      />
                    </div>
                    <div>
                      <Label>Degree *</Label>
                      <Input
                        value={edu.degree}
                        onChange={(e) =>
                          updateEducation(edu.id, "degree", e.target.value)
                        }
                        placeholder="Bachelor of Science"
                        data-testid={`input-degree-${index}`}
                      />
                    </div>
                    <div>
                      <Label>Field of Study *</Label>
                      <Input
                        value={edu.field}
                        onChange={(e) =>
                          updateEducation(edu.id, "field", e.target.value)
                        }
                        placeholder="Computer Science"
                        data-testid={`input-field-${index}`}
                      />
                    </div>
                    <div>
                      <Label>Start Date *</Label>
                      <Input
                        value={edu.startDate}
                        onChange={(e) =>
                          updateEducation(edu.id, "startDate", e.target.value)
                        }
                        placeholder="Aug 2018"
                        data-testid={`input-start-date-${index}`}
                      />
                    </div>
                    <div>
                      <Label>End Date *</Label>
                      <Input
                        value={edu.endDate}
                        onChange={(e) =>
                          updateEducation(edu.id, "endDate", e.target.value)
                        }
                        placeholder="May 2022"
                        data-testid={`input-end-date-${index}`}
                      />
                    </div>
                    <div className="col-span-2 grid grid-cols-2 gap-4">
                      <div>
                        <Label>Score Type</Label>
                        <Select
                          value={edu.scoreType || ""}
                          onValueChange={(value) =>
                            updateEducation(edu.id, "scoreType", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CGPA">CGPA</SelectItem>
                            <SelectItem value="Percentage">Percentage</SelectItem>
                            <SelectItem value="GPA">GPA (Scale)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {edu.scoreType === "CGPA" && (
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label>CGPA</Label>
                            <Input
                              value={edu.scoreValue || ""}
                              onChange={(e) =>
                                updateEducation(edu.id, "scoreValue", e.target.value)
                              }
                              placeholder="8.5"
                            />
                          </div>
                          <div>
                            <Label>Scale</Label>
                            <Input
                              value={edu.scoreScale || "10"}
                              onChange={(e) =>
                                updateEducation(edu.id, "scoreScale", e.target.value)
                              }
                              placeholder="10"
                            />
                          </div>
                          <div className="col-span-2 text-xs text-muted-foreground flex items-center justify-between">
                            {edu.scoreValue && edu.scoreScale && (
                              <span>
                                Approx: {((parseFloat(edu.scoreValue) / parseFloat(edu.scoreScale)) * 100).toFixed(2)}%
                              </span>
                            )}
                            <div className="flex items-center space-x-2">
                              <Label className="text-xs">Show as:</Label>
                              <Select
                                value={edu.showAs || "Percentage"}
                                onValueChange={(value) =>
                                  updateEducation(edu.id, "showAs", value)
                                }
                              >
                                <SelectTrigger className="h-6 w-24 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="CGPA">CGPA</SelectItem>
                                  <SelectItem value="Percentage">Percentage</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      )}

                      {edu.scoreType === "Percentage" && (
                        <div>
                          <Label>Percentage (%)</Label>
                          <Input
                            value={edu.scoreValue || ""}
                            onChange={(e) =>
                              updateEducation(edu.id, "scoreValue", e.target.value)
                            }
                            placeholder="85"
                          />
                        </div>
                      )}

                      {edu.scoreType === "GPA" && (
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label>Value</Label>
                            <Input
                              value={edu.scoreValue || ""}
                              onChange={(e) =>
                                updateEducation(edu.id, "scoreValue", e.target.value)
                              }
                              placeholder="3.8"
                            />
                          </div>
                          <div>
                            <Label>Scale</Label>
                            <Input
                              value={edu.scoreScale || "4"}
                              onChange={(e) =>
                                updateEducation(edu.id, "scoreScale", e.target.value)
                              }
                              placeholder="4"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            <Button
              onClick={addEducation}
              variant="outline"
              className="w-full"
              data-testid="button-add-education"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Education
            </Button>
          </AccordionContent>
        </AccordionItem>

        {/* Experience - Hidden for Freshers */}
        {!data.personal.isFresher && (
          <AccordionItem value="experience" className="border rounded-lg px-6">
            <AccordionTrigger className="hover:no-underline py-4" data-testid="accordion-experience">
              <span className="text-lg font-semibold">Work Experience</span>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pb-6">
              {data.experience?.map((exp, index) => (
                <Card key={exp.id} className="p-4 relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={() => removeExperience(exp.id)}
                    data-testid={`button-remove-experience-${index}`}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                  <div className="space-y-4 pr-10">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <Label>Company *</Label>
                        <Input
                          value={exp.company}
                          onChange={(e) =>
                            updateExperience(exp.id, "company", e.target.value)
                          }
                          placeholder="Tech Corp"
                          data-testid={`input-company-${index}`}
                        />
                      </div>
                      <div className="col-span-2">
                        <Label>Position *</Label>
                        <Input
                          value={exp.position}
                          onChange={(e) =>
                            updateExperience(exp.id, "position", e.target.value)
                          }
                          placeholder="Software Engineer"
                          data-testid={`input-position-${index}`}
                        />
                      </div>
                      <div>
                        <Label>Start Date *</Label>
                        <Input
                          value={exp.startDate}
                          onChange={(e) =>
                            updateExperience(exp.id, "startDate", e.target.value)
                          }
                          placeholder="Jan 2022"
                          data-testid={`input-exp-start-${index}`}
                        />
                      </div>
                      <div>
                        <Label>End Date *</Label>
                        <Input
                          value={exp.endDate}
                          onChange={(e) =>
                            updateExperience(exp.id, "endDate", e.target.value)
                          }
                          placeholder="Present"
                          disabled={exp.current}
                          data-testid={`input-exp-end-${index}`}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Responsibilities & Achievements</Label>
                      {exp.bullets.map((bullet, bulletIdx) => (
                        <div key={bulletIdx} className="flex gap-2">
                          <Input
                            value={bullet}
                            onChange={(e) =>
                              updateBullet(exp.id, bulletIdx, e.target.value)
                            }
                            placeholder="Describe your achievement or responsibility..."
                            data-testid={`input-bullet-${index}-${bulletIdx}`}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeBullet(exp.id, bulletIdx)}
                            disabled={exp.bullets.length === 1}
                            data-testid={`button-remove-bullet-${index}-${bulletIdx}`}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addBullet(exp.id)}
                        data-testid={`button-add-bullet-${index}`}
                      >
                        <Plus className="mr-2 h-3 w-3" />
                        Add Bullet Point
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
              <Button
                onClick={addExperience}
                variant="outline"
                className="w-full"
                data-testid="button-add-experience"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Experience
              </Button>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Projects */}
        <AccordionItem value="projects" className="border rounded-lg px-6">
          <AccordionTrigger className="hover:no-underline py-4" data-testid="accordion-projects">
            <span className="text-lg font-semibold">Projects</span>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pb-6">
            {data.projects.map((project, index) => (
              <Card key={project.id} className="p-4 relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8"
                  onClick={() => removeProject(project.id)}
                  data-testid={`button-remove-project-${index}`}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
                <div className="space-y-4 pr-10">
                  <div>
                    <Label>Project Name *</Label>
                    <Input
                      value={project.name}
                      onChange={(e) =>
                        updateProject(project.id, "name", e.target.value)
                      }
                      placeholder="E-commerce Platform"
                      data-testid={`input-project-name-${index}`}
                    />
                  </div>
                  <div>
                    <Label>Description *</Label>
                    <Textarea
                      value={project.description}
                      onChange={(e) =>
                        updateProject(project.id, "description", e.target.value)
                      }
                      placeholder="Describe your project..."
                      className="min-h-24"
                      data-testid={`input-project-desc-${index}`}
                    />
                  </div>
                  <div>
                    <Label>Technologies (comma-separated) *</Label>
                    <Input
                      value={project.technologies.join(", ")}
                      onChange={(e) =>
                        updateProject(
                          project.id,
                          "technologies",
                          e.target.value.split(",").map((t) => t.trim())
                        )
                      }
                      placeholder="React, Node.js, PostgreSQL"
                      data-testid={`input-project-tech-${index}`}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <Label>Link</Label>
                      <Input
                        value={project.link || ""}
                        onChange={(e) =>
                          updateProject(project.id, "link", e.target.value)
                        }
                        placeholder="https://github.com/username/project"
                        data-testid={`input-project-link-${index}`}
                      />
                    </div>
                    <div>
                      <Label>Link Label</Label>
                      <Input
                        value={project.linkLabel || ""}
                        onChange={(e) =>
                          updateProject(project.id, "linkLabel", e.target.value)
                        }
                        placeholder="Repo / Live"
                        data-testid={`input-project-link-label-${index}`}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            <Button
              onClick={addProject}
              variant="outline"
              className="w-full"
              data-testid="button-add-project"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Project
            </Button>
          </AccordionContent>
        </AccordionItem>

        {/* Skills */}
        <AccordionItem value="skills" className="border rounded-lg px-6">
          <AccordionTrigger className="hover:no-underline py-4" data-testid="accordion-skills">
            <span className="text-lg font-semibold">Skills</span>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pb-6">
            {data.skills.map((skillGroup, index) => (
              <Card key={skillGroup.id} className="p-4 relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8"
                  onClick={() => removeSkillGroup(skillGroup.id)}
                  data-testid={`button-remove-skill-${index}`}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
                <div className="space-y-4 pr-10">
                  <div>
                    <Label>Category *</Label>
                    <Input
                      value={skillGroup.category}
                      onChange={(e) =>
                        updateSkillGroup(skillGroup.id, "category", e.target.value)
                      }
                      placeholder="Programming Languages"
                      data-testid={`input-skill-category-${index}`}
                    />
                  </div>
                  <div>
                    <Label>Skills (comma-separated) *</Label>
                    <Input
                      value={skillGroup.items.join(", ")}
                      onChange={(e) => {
                        // We keep the raw input for better UX while typing
                        updateSkillGroup(
                          skillGroup.id,
                          "items",
                          e.target.value.split(",").map(s => s.trim())
                        );
                      }}
                      onBlur={(e) => {
                        const items = e.target.value
                          .split(",")
                          .map((s) => s.trim()) // Don't lowercase here to preserve user casing preference, but we could
                          .filter((s, i, self) => s && self.indexOf(s) === i);
                        updateSkillGroup(skillGroup.id, "items", items);
                      }}
                      placeholder="javascript, typescript, python"
                      data-testid={`input-skill-items-${index}`}
                    />
                    <SkillsSuggester
                      currentSkills={skillGroup.items}
                      onAddSkill={(skill) => {
                        const newItems = [...skillGroup.items, skill];
                        // Normalize and unique
                        const uniqueItems = newItems
                          .map(s => s.trim())
                          .filter((s, i, self) => s && self.indexOf(s) === i);
                        updateSkillGroup(skillGroup.id, "items", uniqueItems);
                      }}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Suggested: java, python, react, node.js, sql, aws, docker
                    </p>
                  </div>
                </div>
              </Card>
            ))}
            <Button
              onClick={addSkillGroup}
              variant="outline"
              className="w-full"
              data-testid="button-add-skill"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Skill Group
            </Button>
          </AccordionContent>
        </AccordionItem>

        {/* Certifications */}
        <AccordionItem value="certifications" className="border rounded-lg px-6">
          <AccordionTrigger className="hover:no-underline py-4" data-testid="accordion-certifications">
            <span className="text-lg font-semibold">Certifications</span>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pb-6">
            {data.certifications.map((cert, index) => (
              <Card key={cert.id} className="p-4 relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8"
                  onClick={() => removeCertification(cert.id)}
                  data-testid={`button-remove-cert-${index}`}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
                <div className="space-y-4 pr-10">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label>Certification Name *</Label>
                      <Input
                        value={cert.name}
                        onChange={(e) =>
                          updateCertification(cert.id, "name", e.target.value)
                        }
                        placeholder="AWS Certified Solutions Architect"
                        data-testid={`input-cert-name-${index}`}
                      />
                    </div>
                    <div>
                      <Label>Issuer *</Label>
                      <Input
                        value={cert.issuer}
                        onChange={(e) =>
                          updateCertification(cert.id, "issuer", e.target.value)
                        }
                        placeholder="Amazon Web Services"
                        data-testid={`input-cert-issuer-${index}`}
                      />
                    </div>
                    <div>
                      <Label>Date *</Label>
                      <Input
                        value={cert.date}
                        onChange={(e) =>
                          updateCertification(cert.id, "date", e.target.value)
                        }
                        placeholder="May 2023"
                        data-testid={`input-cert-date-${index}`}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Link</Label>
                      <Input
                        value={cert.link || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateCertification(cert.id, "link", val);
                          // Simple validation visual cue could be added here or on blur
                        }}
                        className={cert.link && !cert.link.startsWith('http') ? "border-red-500" : ""}
                        placeholder="https://..."
                        data-testid={`input-cert-link-${index}`}
                      />
                      {cert.link && !cert.link.startsWith('http') && (
                        <p className="text-xs text-red-500 mt-1">URL must start with http:// or https://</p>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            <Button
              onClick={addCertification}
              variant="outline"
              className="w-full"
              data-testid="button-add-cert"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Certification
            </Button>
          </AccordionContent>
        </AccordionItem>

        {/* Languages */}
        <AccordionItem value="languages" className="border rounded-lg px-6">
          <AccordionTrigger className="hover:no-underline py-4" data-testid="accordion-languages">
            <span className="text-lg font-semibold">Languages</span>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pb-6">
            {data.languages.map((lang, index) => (
              <Card key={lang.id} className="p-4 relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8"
                  onClick={() => removeLanguage(lang.id)}
                  data-testid={`button-remove-lang-${index}`}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
                <div className="grid grid-cols-2 gap-4 pr-10">
                  <div>
                    <Label>Language *</Label>
                    <Input
                      value={lang.language}
                      onChange={(e) =>
                        updateLanguage(lang.id, "language", e.target.value)
                      }
                      placeholder="English"
                      data-testid={`input-lang-name-${index}`}
                    />
                  </div>
                  <div>
                    <Label>Proficiency *</Label>
                    <Input
                      value={lang.proficiency}
                      onChange={(e) =>
                        updateLanguage(lang.id, "proficiency", e.target.value)
                      }
                      placeholder="Native / Fluent / Professional"
                      data-testid={`input-lang-prof-${index}`}
                    />
                  </div>
                </div>
              </Card>
            ))}
            <Button
              onClick={addLanguage}
              variant="outline"
              className="w-full"
              data-testid="button-add-lang"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Language
            </Button>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
