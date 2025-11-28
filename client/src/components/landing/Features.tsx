import React from "react";
import { FileText, Zap, Layout, Download, Sparkles, Target } from "lucide-react";

const features = [
    {
        icon: <Layout className="h-6 w-6 text-indigo-600" />,
        title: "ATS-Optimized Templates",
        description: "Professionally designed templates that pass Applicant Tracking Systems and highlight your strengths."
    },
    {
        icon: <Sparkles className="h-6 w-6 text-indigo-600" />,
        title: "AI-Powered Suggestions",
        description: "Get intelligent phrasing and skill suggestions tailored to your target job role."
    },
    {
        icon: <Zap className="h-6 w-6 text-indigo-600" />,
        title: "Instant Feedback",
        description: "Real-time analysis of your resume content to improve impact and readability."
    },
    {
        icon: <Download className="h-6 w-6 text-indigo-600" />,
        title: "Multiple Export Formats",
        description: "Download your resume in PDF or DOCX formats, or share a live link with recruiters."
    },
    {
        icon: <Target className="h-6 w-6 text-indigo-600" />,
        title: "Keyword Optimization",
        description: "Automatically identify and include relevant keywords from job descriptions."
    },
    {
        icon: <FileText className="h-6 w-6 text-indigo-600" />,
        title: "Cover Letter Builder",
        description: "Create matching cover letters that complement your resume and tell your story."
    }
];

export default function Features() {
    return (
        <section id="features" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Features</h2>
                    <p className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
                        Everything you need to land your next job
                    </p>
                    <p className="mt-4 text-lg text-slate-600">
                        Our tools help you build a professional resume in minutes, not hours.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="relative p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-lg transition-shadow duration-300">
                            <div className="inline-flex items-center justify-center p-3 bg-indigo-50 rounded-xl mb-5">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                            <p className="text-slate-600 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
