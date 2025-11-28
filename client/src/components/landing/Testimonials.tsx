import React from "react";
import { Star } from "lucide-react";

const testimonials = [
    {
        content: "I was struggling to get interviews until I used ResuOne. The ATS optimization really works! I landed a job at a top tech company within weeks.",
        author: "Sarah J.",
        role: "Software Engineer",
        rating: 5
    },
    {
        content: "The AI suggestions helped me phrase my achievements perfectly. It's like having a professional resume writer by your side.",
        author: "Michael T.",
        role: "Marketing Manager",
        rating: 5
    },
    {
        content: "Simple, fast, and effective. The templates are beautiful and professional. Highly recommended for anyone job hunting.",
        author: "Emily R.",
        role: "Product Designer",
        rating: 5
    }
];

export default function Testimonials() {
    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Testimonials</h2>
                    <p className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
                        Success Stories
                    </p>
                    <p className="mt-4 text-lg text-slate-600">
                        See what our users are saying about their job search success.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                            <div className="flex gap-1 mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                                ))}
                            </div>
                            <p className="text-slate-700 mb-6 italic">"{testimonial.content}"</p>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                    {testimonial.author[0]}
                                </div>
                                <div>
                                    <div className="font-semibold text-slate-900">{testimonial.author}</div>
                                    <div className="text-sm text-slate-500">{testimonial.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
