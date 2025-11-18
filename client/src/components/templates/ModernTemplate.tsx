import type { ResumeData } from "@shared/schema";

interface ModernTemplateProps {
  data: ResumeData;
}

export function ModernTemplate({ data }: ModernTemplateProps) {
  return (
    <div className="bg-white text-black p-12 font-sans leading-normal" style={{ minHeight: "11in", width: "8.5in" }}>
      {/* Header */}
      <header className="mb-8 pb-5 border-b-2 border-gray-800">
        <h1 className="text-5xl font-bold mb-3 text-gray-900 tracking-tight">{data.personal.fullName || "Your Name"}</h1>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-700">
          {data.personal.email && <span>{data.personal.email}</span>}
          {data.personal.phone && <span>{data.personal.phone}</span>}
          {data.personal.location && <span>{data.personal.location}</span>}
          {data.personal.linkedin && <span>{data.personal.linkedin}</span>}
          {data.personal.website && <span>{data.personal.website}</span>}
        </div>
      </header>

      {/* Summary */}
      {data.summary && (
        <section className="mb-8">
          <h2 className="text-lg font-bold mb-3 text-gray-900 border-l-4 border-gray-800 pl-3 tracking-wide">
            PROFESSIONAL SUMMARY
          </h2>
          <p className="text-base leading-relaxed text-gray-900">{data.summary}</p>
        </section>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold mb-4 text-gray-900 border-l-4 border-gray-800 pl-3 tracking-wide">
            EXPERIENCE
          </h2>
          {data.experience.map((exp) => (
            <div key={exp.id} className="mb-5">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="text-base font-bold text-gray-900">{exp.position}</h3>
                <span className="text-sm text-gray-700 whitespace-nowrap ml-4">
                  {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                </span>
              </div>
              <p className="text-sm font-semibold text-gray-800 mb-2.5">{exp.company}</p>
              <ul className="space-y-1.5 ml-5" style={{ listStyleType: 'disc' }}>
                {exp.bullets.map((bullet, idx) => (
                  <li key={idx} className="text-base leading-relaxed text-gray-900 pl-1">
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
        <section className="mb-8">
          <h2 className="text-lg font-bold mb-4 text-gray-900 border-l-4 border-gray-800 pl-3 tracking-wide">
            EDUCATION
          </h2>
          {data.education.map((edu) => (
            <div key={edu.id} className="mb-4">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="text-base font-bold text-gray-900">{edu.degree} in {edu.field}</h3>
                <span className="text-sm text-gray-700 whitespace-nowrap ml-4">
                  {edu.startDate} – {edu.endDate}
                </span>
              </div>
              <p className="text-base text-gray-900">{edu.institution}</p>
              {edu.gpa && <p className="text-base text-gray-800 mt-0.5">GPA: {edu.gpa}</p>}
            </div>
          ))}
        </section>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold mb-4 text-gray-900 border-l-4 border-gray-800 pl-3 tracking-wide">
            PROJECTS
          </h2>
          {data.projects.map((project) => (
            <div key={project.id} className="mb-4">
              <h3 className="text-base font-bold text-gray-900 mb-1.5">{project.name}</h3>
              <p className="text-base leading-relaxed text-gray-900 mb-1.5">{project.description}</p>
              <p className="text-base text-gray-800">
                <span className="font-semibold">Technologies:</span> {project.technologies.join(", ")}
              </p>
              {project.link && <p className="text-base text-gray-800 mt-0.5">{project.link}</p>}
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold mb-4 text-gray-900 border-l-4 border-gray-800 pl-3 tracking-wide">
            SKILLS
          </h2>
          <div className="space-y-2">
            {data.skills.map((skillGroup) => (
              <p key={skillGroup.id} className="text-base leading-relaxed text-gray-900">
                <span className="font-semibold">{skillGroup.category}:</span>{" "}
                {skillGroup.items.join(", ")}
              </p>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold mb-4 text-gray-900 border-l-4 border-gray-800 pl-3 tracking-wide">
            CERTIFICATIONS
          </h2>
          {data.certifications.map((cert) => (
            <div key={cert.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <h3 className="text-base font-bold text-gray-900">{cert.name}</h3>
                <span className="text-sm text-gray-700 whitespace-nowrap ml-4">{cert.date}</span>
              </div>
              <p className="text-base text-gray-900">{cert.issuer}</p>
            </div>
          ))}
        </section>
      )}

      {/* Languages */}
      {data.languages.length > 0 && (
        <section>
          <h2 className="text-lg font-bold mb-4 text-gray-900 border-l-4 border-gray-800 pl-3 tracking-wide">
            LANGUAGES
          </h2>
          <div className="flex flex-wrap gap-4">
            {data.languages.map((lang) => (
              <span key={lang.id} className="text-base text-gray-900">
                <span className="font-semibold">{lang.language}</span> - {lang.proficiency}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
