import type { ResumeData } from "@shared/schema";

interface ATSSimpleTemplateProps {
    data: ResumeData;
}

export function ATSSimpleTemplate({ data }: ATSSimpleTemplateProps) {
    return (
        <div className="bg-white text-black p-12 font-sans leading-normal" style={{ minHeight: "11in", width: "8.5in", fontFamily: 'Arial, Helvetica, sans-serif' }}>
            {/* Header */}
            <header className="mb-6 text-center">
                <h1 className="text-3xl font-bold mb-2 uppercase tracking-wide">{data.personal.fullName || "Your Name"}</h1>
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm">
                    {data.personal.email && <span>{data.personal.email}</span>}
                    {data.personal.phone && <span>| {data.personal.phone}</span>}
                    {data.personal.location && <span>| {data.personal.location}</span>}
                    {data.personal.linkedin && <span>| {data.personal.linkedin}</span>}
                    {data.personal.website && <span>| {data.personal.website}</span>}
                </div>
            </header>

            <hr className="border-black mb-6" />

            {/* Summary */}
            {data.summary && (
                <section className="mb-6">
                    <h2 className="text-lg font-bold mb-2 uppercase border-b border-gray-300 pb-1">Professional Summary</h2>
                    <p className="text-sm leading-relaxed text-justify">{data.summary}</p>
                </section>
            )}

            {/* Experience */}
            {data.experience && data.experience.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-lg font-bold mb-3 uppercase border-b border-gray-300 pb-1">Work Experience</h2>
                    {data.experience.map((exp) => (
                        <div key={exp.id} className="mb-4">
                            <div className="flex justify-between items-baseline mb-1">
                                <h3 className="text-base font-bold">{exp.position}</h3>
                                <span className="text-sm font-medium">
                                    {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                                </span>
                            </div>
                            <p className="text-sm font-semibold mb-2">{exp.company}</p>
                            <ul className="list-disc ml-5 space-y-1">
                                {exp.bullets.map((bullet, idx) => (
                                    <li key={idx} className="text-sm pl-1">
                                        {bullet}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </section>
            )}

            {/* Education */}
            {data.education.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-lg font-bold mb-3 uppercase border-b border-gray-300 pb-1">Education</h2>
                    {data.education.map((edu) => (
                        <div key={edu.id} className="mb-3">
                            <div className="flex justify-between items-baseline mb-1">
                                <h3 className="text-base font-bold">{edu.institution}</h3>
                                <span className="text-sm font-medium">
                                    {edu.startDate} – {edu.endDate}
                                </span>
                            </div>
                            <p className="text-sm">{edu.degree} in {edu.field}</p>
                            {edu.gpa && <p className="text-sm mt-0.5">GPA: {edu.gpa}</p>}
                        </div>
                    ))}
                </section>
            )}

            {/* Skills */}
            {data.skills.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-lg font-bold mb-3 uppercase border-b border-gray-300 pb-1">Skills</h2>
                    <div className="space-y-1">
                        {data.skills.map((skillGroup) => (
                            <p key={skillGroup.id} className="text-sm">
                                <span className="font-bold">{skillGroup.category}:</span>{" "}
                                {skillGroup.items.join(", ")}
                            </p>
                        ))}
                    </div>
                </section>
            )}

            {/* Projects */}
            {data.projects.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-lg font-bold mb-3 uppercase border-b border-gray-300 pb-1">Projects</h2>
                    {data.projects.map((project) => (
                        <div key={project.id} className="mb-3">
                            <div className="flex justify-between items-baseline mb-1">
                                <h3 className="text-base font-bold">{project.name}</h3>
                                {project.link && <span className="text-sm text-blue-800 underline">{project.link}</span>}
                            </div>
                            <p className="text-sm mb-1">{project.description}</p>
                            <p className="text-sm">
                                <span className="font-semibold">Technologies:</span> {project.technologies.join(", ")}
                            </p>
                        </div>
                    ))}
                </section>
            )}

            {/* Certifications */}
            {data.certifications.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-lg font-bold mb-3 uppercase border-b border-gray-300 pb-1">Certifications</h2>
                    {data.certifications.map((cert) => (
                        <div key={cert.id} className="mb-2 flex justify-between">
                            <div>
                                <span className="text-sm font-bold">{cert.name}</span>
                                <span className="text-sm"> - {cert.issuer}</span>
                            </div>
                            <span className="text-sm">{cert.date}</span>
                        </div>
                    ))}
                </section>
            )}

            {/* Languages */}
            {data.languages.length > 0 && (
                <section>
                    <h2 className="text-lg font-bold mb-3 uppercase border-b border-gray-300 pb-1">Languages</h2>
                    <p className="text-sm">
                        {data.languages.map((lang, index) => (
                            <span key={lang.id}>
                                {lang.language} ({lang.proficiency}){index < data.languages.length - 1 ? ", " : ""}
                            </span>
                        ))}
                    </p>
                </section>
            )}
        </div>
    );
}
