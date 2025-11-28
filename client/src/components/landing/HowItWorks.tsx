import React from "react";
import { User, FileText, CheckSquare, Download } from "lucide-react";

const steps = [
    {
        icon: <User className="h-8 w-8 text-white" />,
        title: "Create Profile",
        description: "Enter your personal details, experience, and education once.",
        color: "bg-blue-500"
    },
    {
        icon: <FileText className="h-8 w-8 text-white" />,
        title: "Choose Template",
        description: "Select from our collection of ATS-friendly professional templates.",
        color: "bg-indigo-500"
    },
    {
        icon: <CheckSquare className="h-8 w-8 text-white" />,
        title: "Customize & Optimize",
        description: "Use AI suggestions to refine your content and match job descriptions.",
        color: "bg-violet-500"
    },
    {
        icon: <Download className="h-8 w-8 text-white" />,
        title: "Download & Apply",
        description: "Export as PDF or DOCX and start applying to your dream jobs.",
        color: "bg-purple-500"
    }
];

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="py-24 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Process</h2>
                    <p className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
                        Simple, Fast Process
                    </p>
                    <p className="mt-4 text-lg text-slate-600">
                        Go from blank page to hired in four simple steps.
                    </p>
                </div>

                <div className="relative">
                    {/* Connector Line (Desktop) */}
                    <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 z-0"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                        {steps.map((step, index) => (
                            <div key={index} className="flex flex-col items-center text-center bg-white p-6 rounded-xl shadow-sm border border-slate-100 lg:bg-transparent lg:shadow-none lg:border-none">
                                <div className={`flex items-center justify-center w-16 h-16 rounded-2xl shadow-lg mb-6 ${step.color} transform transition-transform hover:scale-110 duration-300`}>
                                    {step.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                                <p className="text-slate-600">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
