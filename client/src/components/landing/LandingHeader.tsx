import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export default function LandingHeader() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm py-4" : "bg-transparent py-6"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                <Link href="/">
                    <div className="text-2xl font-extrabold text-slate-900 cursor-pointer">ResuOne</div>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center space-x-8">
                    <a href="#features" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Features</a>
                    <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">How it Works</a>
                    <a href="#testimonials" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Testimonials</a>
                    <Link href="/login">
                        <Button variant="ghost" className="text-slate-600 hover:text-indigo-600 hover:bg-indigo-50">
                            Sign In
                        </Button>
                    </Link>
                    <Link href="/register">
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200">
                            Get Started
                        </Button>
                    </Link>
                </nav>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="text-slate-600 hover:text-slate-900 focus:outline-none"
                    >
                        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-100 shadow-lg p-4 flex flex-col space-y-4 animate-in slide-in-from-top-5">
                    <a
                        href="#features"
                        className="text-base font-medium text-slate-600 hover:text-indigo-600"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Features
                    </a>
                    <a
                        href="#how-it-works"
                        className="text-base font-medium text-slate-600 hover:text-indigo-600"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        How it Works
                    </a>
                    <a
                        href="#testimonials"
                        className="text-base font-medium text-slate-600 hover:text-indigo-600"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Testimonials
                    </a>
                    <div className="pt-4 flex flex-col gap-3">
                        <Link href="/login">
                            <Button variant="outline" className="w-full justify-center">Sign In</Button>
                        </Link>
                        <Link href="/register">
                            <Button className="w-full justify-center bg-indigo-600 hover:bg-indigo-700">Get Started</Button>
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
