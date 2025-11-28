import type { ResumeData } from "@shared/schema";
import { Mail, Phone, MapPin, Linkedin, Globe, Github, Terminal, Twitter } from "lucide-react";

interface TemplateProps {
    data: ResumeData;
    font?: string;
}

export function MinimalTemplate({ data, font = "sans" }: TemplateProps) {
    const { personal, education, experience, skills, projects, certifications, languages, summary } = data;

    const fontClass = {
        sans: "font-sans",
        serif: "font-serif",
        mono: "font-mono",
    }[font] || "font-sans";

    return (
        <div className={`max-w-[210mm] mx-auto bg-white p-8 ${fontClass} text-sm leading-relaxed text-gray-800`}>
            {/* Header */}
            <header className="border-b pb-4 mb-6">
                <h1 className="text-3xl font-bold uppercase tracking-wide mb-2">{personal.fullName}</h1>
                <div className="flex flex-wrap gap-4 text-xs text-gray-600">
                    {personal.email && (
                        <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            <span>{personal.email}</span>
                        </div>
                    )}
                    {personal.phone && (
                        <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            <span>{personal.phone}</span>
                        </div>
                    )}
                    {personal.location && (
                        <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{personal.location}</span>
                        </div>
                    )}
                    {personal.linkedin && (
                        <div className="flex items-center gap-1">
                            <Linkedin className="w-3 h-3" />
                            <a href={personal.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">LinkedIn</a>
                        </div>
                    )}
                    {personal.github && (
                        <div className="flex items-center gap-1">
                            <Github className="w-3 h-3" />
                            <a href={`https://${personal.github}`} target="_blank" rel="noopener noreferrer" className="hover:underline">GitHub</a>
                        </div>
                    )}
                    {personal.website && (
                        <div className="flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            <a href={`https://${personal.website}`} target="_blank" rel="noopener noreferrer" className="hover:underline">Portfolio</a>
                        </div>
                    )}
                    {personal.leetcode && (
                        <div className="flex items-center gap-1">
                            <Terminal className="w-3 h-3" />
                            <a href={`https://${personal.leetcode}`} target="_blank" rel="noopener noreferrer" className="hover:underline">LeetCode</a>
                        </div>
                    )}
                    {personal.twitter && (
                        <div className="flex items-center gap-1">
                            <Twitter className="w-3 h-3" />
                            <a href={`https://${personal.twitter}`} target="_blank" rel="noopener noreferrer" className="hover:underline">Twitter</a>
                        </div>
                    )}
                    {personal.customLink && (
                        <div className="flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            <a href={personal.customLink} target="_blank" rel="noopener noreferrer" className="hover:underline">{personal.customLinkLabel || "Link"}</a>
                        </div>
                    )}
                </div>
            </header>

            {/* Summary */}
            {summary && (
                <section className="mb-6">
                    <h2 className="text-xs font-bold uppercase tracking-wider border-b mb-2 pb-1">Summary</h2>
                    <p className="text-gray-700">{summary}</p>
                </section>
            )}

            {/* Experience */}
            {experience && experience.length > 0 && !personal.isFresher && (
                <section className="mb-6">
                    <h2 className="text-xs font-bold uppercase tracking-wider border-b mb-3 pb-1">Experience</h2>
                    <div className="space-y-4">
                        {[...experience].reverse().map((exp) => (
                            <div key={exp.id}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold">{exp.position}</h3>
                                    <span className="text-xs text-gray-500 whitespace-nowrap">
                                        {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                                    </span>
                                </div>
                                <div className="text-xs font-medium text-gray-600 mb-2">{exp.company}</div>
                                <ul className="list-disc list-outside ml-4 space-y-1 text-gray-700">
                                    {exp.bullets.map((bullet, i) => (
                                        <li key={i}>{bullet}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Projects */}
            {projects && projects.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-xs font-bold uppercase tracking-wider border-b mb-3 pb-1">Projects</h2>
                    <div className="space-y-3">
                        {projects.map((project) => (
                            <div key={project.id}>
                                <div className="flex items-baseline gap-2 mb-1">
                                    <h3 className="font-bold">{project.name}</h3>
                                    {project.link && (
                                        <a
                                            href={project.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-blue-600 hover:underline border border-blue-200 px-1 rounded"
                                        >
                                            {project.linkLabel || "Link"}
                                        </a>
                                    )}
                                </div>
                                <p className="text-gray-700 mb-1">{project.description}</p>
                                <div className="flex flex-wrap gap-1">
                                    {project.technologies.map((tech, i) => (
                                        <span key={i} className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Education */}
            {education && education.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-xs font-bold uppercase tracking-wider border-b mb-3 pb-1">Education</h2>
                    <div className="space-y-3">
                        {[...education].reverse().map((edu) => (
                            <div key={edu.id}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold">{edu.institution}</h3>
                                    <span className="text-xs text-gray-500 whitespace-nowrap">
                                        {edu.startDate} - {edu.endDate}
                                    </span>
                                </div>
                                <div className="flex justify-between items-baseline">
                                    <div className="text-sm text-gray-700">
                                        {edu.degree} in {edu.field}
                                    </div>
                                    {edu.scoreValue && (
                                        <div className="text-xs font-medium text-gray-600">
                                            {edu.showAs === "Percentage" && edu.scoreScale ? (
                                                <span>{((parseFloat(edu.scoreValue) / parseFloat(edu.scoreScale)) * 100).toFixed(2)}%</span>
                                            ) : (
                                                <span>{edu.scoreType} {edu.scoreValue}{edu.scoreScale ? `/${edu.scoreScale}` : ''}</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills */}
            {skills && skills.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-xs font-bold uppercase tracking-wider border-b mb-3 pb-1">Skills</h2>
                    <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
                        {skills.map((group) => (
                            <div key={group.id} className="contents">
                                <span className="font-medium text-gray-800 whitespace-nowrap">{group.category}:</span>
                                <span className="text-gray-700">{group.items.join(", ")}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Certifications */}
            {certifications && certifications.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-xs font-bold uppercase tracking-wider border-b mb-3 pb-1">Certifications</h2>
                    <ul className="space-y-1">
                        {certifications.map((cert) => (
                            <li key={cert.id} className="flex items-baseline justify-between text-sm">
                                <div>
                                    {cert.link ? (
                                        <a href={cert.link} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline text-blue-700">
                                            {cert.name}
                                        </a>
                                    ) : (
                                        <span className="font-medium">{cert.name}</span>
                                    )}
                                    <span className="text-gray-600"> — {cert.issuer}</span>
                                </div>
                                <span className="text-xs text-gray-500">{cert.date}</span>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </div>
    );
}
