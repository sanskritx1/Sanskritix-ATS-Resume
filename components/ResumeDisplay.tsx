import React, { useState } from 'react';
import type { ResumeData, FormData } from '../types';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { DownloadIcon } from './icons/DownloadIcon';

interface ResumeDisplayProps {
  resumeData: ResumeData | null;
  isLoading: boolean;
  error: string | null;
  currentFormData: FormData | null;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-6">
        <h3 className="text-xl font-semibold text-cyan-400 border-b-2 border-slate-700 pb-2 mb-3">{title}</h3>
        {children}
    </div>
);

const getScoreColor = (score: number): string => {
    if (score >= 90) return 'bg-green-500/20 text-green-300 border-green-500';
    if (score >= 80) return 'bg-yellow-500/20 text-yellow-300 border-yellow-500';
    return 'bg-red-500/20 text-red-300 border-red-500';
};

export const ResumeDisplay: React.FC<ResumeDisplayProps> = ({ resumeData, isLoading, error, currentFormData }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (!resumeData) return;
        navigator.clipboard.writeText(JSON.stringify(resumeData, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleExportPdf = () => {
        if (!resumeData || !currentFormData) return;

        // @ts-ignore - jsPDF is loaded from CDN
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'pt', 'a4');
        
        // --- Constants for styling ---
        const MARGIN = 40;
        const FONT_SIZES = { H1: 22, H2: 12, P: 10, SMALL: 8 };
        const COLORS = { PRIMARY: '#0891b2', TEXT: '#334155', MUTED: '#64748b', LINE: '#cbd5e1' };
        const PAGE_WIDTH = doc.internal.pageSize.getWidth();
        const PAGE_HEIGHT = doc.internal.pageSize.getHeight();
        const USABLE_WIDTH = PAGE_WIDTH - MARGIN * 2;
        let y = MARGIN;

        const checkPageBreak = (neededHeight: number) => {
            if (y + neededHeight > PAGE_HEIGHT - MARGIN) {
                doc.addPage();
                y = MARGIN;
            }
        };

        // --- Header ---
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(FONT_SIZES.H1);
        doc.setTextColor(COLORS.TEXT);
        doc.text(currentFormData.fullName, PAGE_WIDTH / 2, y, { align: 'center' });
        y += 25;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(FONT_SIZES.P);
        doc.setTextColor(COLORS.MUTED);
        const contactInfo = `${currentFormData.email} • ${currentFormData.phone} • ${currentFormData.linkedin}`;
        doc.text(contactInfo, PAGE_WIDTH / 2, y, { align: 'center' });
        y += 30;

        // --- Section Drawing Function ---
        const drawSection = (title: string, bodyFn: () => void) => {
            checkPageBreak(40);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(FONT_SIZES.H2);
            doc.setTextColor(COLORS.PRIMARY);
            doc.text(title.toUpperCase(), MARGIN, y);
            doc.setDrawColor(COLORS.LINE);
            doc.line(MARGIN, y + 3, PAGE_WIDTH - MARGIN, y + 3);
            y += 20;
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(FONT_SIZES.P);
            doc.setTextColor(COLORS.TEXT);
            bodyFn();
            y += 20;
        };
        
        // --- Render Sections ---
        drawSection('Professional Summary', () => {
            const lines = doc.splitTextToSize(resumeData.summary, USABLE_WIDTH);
            doc.text(lines, MARGIN, y);
            y += lines.length * 12; // 12pt per line
        });

        drawSection('Experience', () => {
            resumeData.experience.forEach(exp => {
                checkPageBreak(60);
                doc.setFont('helvetica', 'bold');
                doc.text(exp.role, MARGIN, y);
                doc.setFont('helvetica', 'normal');
                const companyDuration = `${exp.company} | ${exp.duration}`;
                doc.text(companyDuration, MARGIN, y + 12);
                y += 28;
                exp.achievements.forEach(ach => {
                    const achievementText = `•  ${ach}`;
                    const lines = doc.splitTextToSize(achievementText, USABLE_WIDTH);
                    checkPageBreak(lines.length * 12 + 4);
                    doc.text(lines, MARGIN + 5, y);
                    y += lines.length * 12 + 4;
                });
                y += 10;
            });
        });

        drawSection('Education', () => {
            resumeData.education.forEach(edu => {
                checkPageBreak(40);
                doc.setFont('helvetica', 'bold');
                doc.text(`${edu.degree} - ${edu.year}`, MARGIN, y);
                doc.setFont('helvetica', 'normal');
                doc.text(edu.institution, MARGIN, y + 12);
                if (edu.details) {
                    doc.setFont('helvetica', 'italic');
                    doc.text(edu.details, MARGIN, y + 24);
                    y += 36;
                } else {
                    y += 24;
                }
            });
        });
        
        drawSection('Projects', () => {
            resumeData.projects.forEach(proj => {
                checkPageBreak(40);
                doc.setFont('helvetica', 'bold');
                doc.text(proj.title, MARGIN, y);
                y += 14;
                doc.setFont('helvetica', 'normal');
                const lines = doc.splitTextToSize(proj.description, USABLE_WIDTH);
                doc.text(lines, MARGIN, y);
                y += lines.length * 12 + 8;
            });
        });

        if (resumeData.additional_information && resumeData.additional_information.length > 0) {
            drawSection('Additional Information', () => {
                resumeData.additional_information?.forEach(info => {
                    const infoText = `•  ${info}`;
                    const lines = doc.splitTextToSize(infoText, USABLE_WIDTH);
                    checkPageBreak(lines.length * 12 + 4);
                    doc.text(lines, MARGIN + 5, y);
                    y += lines.length * 12 + 4;
                });
            });
        }

        drawSection('Skills', () => {
            const text = resumeData.skills.join('  •  ');
            const lines = doc.splitTextToSize(text, USABLE_WIDTH);
            doc.text(lines, MARGIN, y);
            y += lines.length * 12;
        });

        // --- Add Footer to all pages ---
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            const footerText = `${currentFormData.fullName} | Page ${i} of ${pageCount}`;
            doc.setFontSize(FONT_SIZES.SMALL);
            doc.setTextColor(COLORS.MUTED);
            doc.text(footerText, PAGE_WIDTH / 2, PAGE_HEIGHT - 20, { align: 'center' });
        }

        doc.save(`${currentFormData.fullName.replace(/\s+/g, '_')}_Resume.pdf`);
    };

    if (isLoading) {
        return (
            <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
                <svg className="animate-spin h-10 w-10 text-cyan-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <h2 className="text-2xl font-bold text-slate-300">Generating Your Resume...</h2>
                <p className="text-slate-400 mt-2">The AI is working its magic. Please wait.</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 bg-red-900/20 border border-red-700 rounded-lg text-center min-h-[400px]">
                <h2 className="text-2xl font-bold text-red-400">An Error Occurred</h2>
                <p className="text-red-300 mt-2">Could not generate resume. Please try again.</p>
                <code className="block bg-slate-900 text-left p-4 rounded-md mt-4 text-sm text-red-300">{error}</code>
            </div>
        );
    }

    if (!resumeData) {
        return (
            <div className="p-8 text-center min-h-[400px] flex flex-col justify-center items-center">
                <h2 className="text-2xl font-bold text-slate-400">Resume Output</h2>
                <p className="text-slate-500 mt-2">Your generated resume will appear here once you submit your details.</p>
            </div>
        );
    }
    
    const score = parseInt(resumeData.ats_score, 10);
    const scoreColorClass = getScoreColor(score);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                 <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-500">Generated Resume</h2>
                <div className="flex items-center gap-2">
                    <button onClick={handleCopy} className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-medium py-2 px-3 rounded-md transition-colors">
                        <ClipboardIcon />
                        {copied ? 'Copied!' : 'Copy JSON'}
                    </button>
                    <button onClick={handleExportPdf} className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium py-2 px-3 rounded-md transition-colors">
                        <DownloadIcon />
                        Export PDF
                    </button>
                </div>
            </div>
           
            <div className={`p-4 rounded-lg border text-center mb-6 ${scoreColorClass}`}>
                <p className="text-lg font-semibold">ATS Score</p>
                <p className="text-5xl font-bold">{resumeData.ats_score}</p>
            </div>

            <Section title="Professional Summary">
                <p className="text-slate-300 leading-relaxed">{resumeData.summary}</p>
            </Section>

            <Section title="Experience">
                {resumeData.experience.map((exp, index) => (
                    <div key={index} className="mb-4 last:mb-0">
                        <h4 className="font-bold text-slate-200">{exp.role}</h4>
                        <p className="text-sm text-slate-400">{exp.company} | {exp.duration}</p>
                        <ul className="list-disc list-inside mt-2 space-y-1 text-slate-300">
                            {exp.achievements.map((ach, i) => <li key={i}>{ach}</li>)}
                        </ul>
                    </div>
                ))}
            </Section>

            <Section title="Education">
                {resumeData.education.map((edu, index) => (
                     <div key={index} className="mb-2">
                        <h4 className="font-bold text-slate-200">{edu.degree} - {edu.year}</h4>
                        <p className="text-sm text-slate-400">{edu.institution}</p>
                        {edu.details && <p className="text-sm text-slate-400 italic mt-1">{edu.details}</p>}
                    </div>
                ))}
            </Section>
            
             <Section title="Projects">
                {resumeData.projects.map((proj, index) => (
                     <div key={index} className="mb-2">
                        <h4 className="font-bold text-slate-200">{proj.title}</h4>
                        <p className="text-sm text-slate-400">{proj.description}</p>
                    </div>
                ))}
            </Section>

            {resumeData.additional_information && resumeData.additional_information.length > 0 && (
                <Section title="Additional Information">
                    <ul className="list-disc list-inside space-y-1 text-slate-300">
                        {resumeData.additional_information.map((info, i) => <li key={i}>{info}</li>)}
                    </ul>
                </Section>
            )}

            <Section title="Skills">
                <div className="flex flex-wrap gap-2">
                    {resumeData.skills.map((skill, index) => (
                        <span key={index} className="bg-cyan-900/50 text-cyan-300 text-sm font-medium px-3 py-1 rounded-full">{skill}</span>
                    ))}
                </div>
            </Section>
            
            <Section title="ATS Keywords">
                <div className="flex flex-wrap gap-2">
                    {resumeData.ats_keywords.map((keyword, index) => (
                        <span key={index} className="bg-slate-700 text-slate-300 text-xs font-medium px-3 py-1 rounded-full">{keyword}</span>
                    ))}
                </div>
            </Section>
            
            <Section title="Improvement Suggestions">
                 <ul className="list-disc list-inside space-y-1 text-slate-300">
                    {resumeData.improvement_suggestions.map((sug, i) => <li key={i}>{sug}</li>)}
                </ul>
            </Section>
        </div>
    );
};