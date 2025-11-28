import type { ResumeData } from "@shared/schema";

interface ATSCleanTemplateProps {
    data: ResumeData;
}

export function ATSCleanTemplate({ data }: ATSCleanTemplateProps) {
    return (
        <div className="bg-white text-slate-900 p-12 font-sans leading-relaxed" style={{ minHeight: "11in", width: "8.5in", fontFamily: 'Calibri, "Open Sans", sans-serif' }}>
            {/* Header */}
            <header className="mb-8">
                <h1 className="text-4xl font-bold mb-1 text-slate-900">{data.personal.fullName || "Your Name"}</h1>
                <div className="text-sm text-slate-700 flex flex-wrap gap-x-4 gap-y-1">
                    {data.personal.location && <span>{data.personal.location}</span>}
                    {data.personal.phone && <span>{data.personal.phone}</span>}
                    {data.personal.email && <span>{data.personal.email}</span>}
                    {data.personal.linkedin && <span>{data.personal.linkedin}</span>}
                    {data.personal.website && <span>{data.personal.website}</span>}
                </div>
            </header>

            {/* Summary */}
            {data.summary && (
                <section className="mb-6">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">Summary</h2>
                    <p className="text-sm text-slate-800">{data.summary}</p>
                </section>
            )}

            {/* Experience */}
            {data.experience && data.experience.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">Experience</h2>
                    <div className="space-y-4">
                        {data.experience.map((exp) => (
                            <div key={exp.id}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="text-base font-bold text-slate-900">{exp.position}</h3>
                                    <span className="text-sm text-slate-600">
                                        {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                                    </span>
                                </div>
                                <div className="text-sm font-semibold text-slate-700 mb-2">{exp.company}</div>
                                <ul className="list-disc ml-4 space-y-1 text-sm text-slate-800">
                                    {exp.bullets.map((bullet, idx) => (
                                        <li key={idx} className="pl-1">
                                            {bullet}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Education */}
            {data.education.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">Education</h2>
                    <div className="space-y-3">
                        {data.education.map((edu) => (
                            <div key={edu.id}>
                                <div className="flex justify-between items-baseline">
                                    <h3 className="text-base font-bold text-slate-900">{edu.institution}</h3>
                                    <span className="text-sm text-slate-600">
                                        {edu.startDate} – {edu.endDate}
                                    </span>
                                </div>
                                <div className="text-sm text-slate-800">
                                    {edu.degree} in {edu.field}
                                    {edu.gpa && <span className="text-slate-600 ml-2">(GPA: {edu.gpa})</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills */}
            {data.skills.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">Skills</h2>
                    <div className="grid grid-cols-1 gap-y-1">
                        {data.skills.map((skillGroup) => (
                            <div key={skillGroup.id} className="text-sm text-slate-800">
                                <span className="font-semibold text-slate-900">{skillGroup.category}:</span>{" "}
                                {skillGroup.items.join(", ")}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Projects */}
            {data.projects.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">Projects</h2>
                    <div className="space-y-3">
                        {data.projects.map((project) => (
                            <div key={project.id}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="text-base font-bold text-slate-900">{project.name}</h3>
                                    {project.link && <span className="text-sm text-slate-600">{project.link}</span>}
                                </div>
                                <p className="text-sm text-slate-800 mb-1">{project.description}</p>
                                <div className="text-sm text-slate-700">
                                    <span className="font-semibold">Tech:</span> {project.technologies.join(", ")}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
