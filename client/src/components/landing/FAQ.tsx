import React from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
    {
        question: "Is ResuOne free to use?",
        answer: "Yes, ResuOne offers a free tier that allows you to create and download a professional resume. We also offer premium features for advanced AI analysis and unlimited exports."
    },
    {
        question: "Are the templates ATS-friendly?",
        answer: "Absolutely. All our templates are designed with Applicant Tracking Systems (ATS) in mind, ensuring your resume gets parsed correctly by hiring software."
    },
    {
        question: "Can I import my existing resume?",
        answer: "Currently, we support building resumes from scratch to ensure the best structure and formatting. We are working on an import feature for the future."
    },
    {
        question: "How does the AI suggestion feature work?",
        answer: "Our AI analyzes your job title and industry to suggest impactful bullet points and skills that are commonly looked for by employers in your field."
    },
    {
        question: "Can I download my resume in Word format?",
        answer: "Yes, you can export your resume in both PDF and DOCX (Word) formats, keeping the formatting intact."
    }
];

export default function FAQ() {
    return (
        <section className="py-24 bg-slate-50">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">FAQ</h2>
                    <p className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
                        Frequently Asked Questions
                    </p>
                </div>

                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className="text-left text-lg font-medium text-slate-900">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-slate-600">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
}
