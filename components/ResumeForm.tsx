import React, { useState, FormEvent } from 'react';
import { SparklesIcon } from './icons/SparklesIcon';
import type { FormData } from '../types';

interface ResumeFormProps {
  onGenerate: (formData: FormData) => void;
  isLoading: boolean;
}

export const ResumeForm: React.FC<ResumeFormProps> = ({ onGenerate, isLoading }) => {
  const [formData, setFormData] = useState<FormData>({
    fullName: 'Riya Patel',
    email: 'riya.patel@gmail.com',
    phone: '9876543210',
    linkedin: 'linkedin.com/in/riyapatel',
    education: 'B.Tech in Computer Engineering, Gujarat Technological University, 2024',
    experience: 'Intern - Web Developer at Sanskritix Global (June 2023 – Sept 2023)\n- Developed responsive web pages using React and Tailwind CSS.\n- Optimized website load time by 35% improving user engagement.',
    skills: 'HTML, CSS, JavaScript, React, Node.js, Git',
    objective: 'To secure a front-end developer position in a growth-oriented company.',
    projects: 'Portfolio Website – Designed a responsive personal website using React and Tailwind CSS.',
    otherDetails: 'Certified AWS Cloud Practitioner (2023)\nWinner of Smart India Hackathon (2022)',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onGenerate(formData);
  };

  const inputClass = "w-full bg-slate-900/80 border border-slate-700 rounded-md p-3 text-slate-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 placeholder-slate-500";
  const labelClass = "block mb-2 text-sm font-medium text-slate-400";
  const textAreaClass = `${inputClass} min-h-[120px] resize-y`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-cyan-400 border-b border-slate-700 pb-3 mb-6">Your Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="fullName" className={labelClass}>Full Name</label>
          <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required className={inputClass} />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>Email</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className={inputClass} />
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>Phone</label>
          <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required className={inputClass} />
        </div>
        <div>
          <label htmlFor="linkedin" className={labelClass}>LinkedIn Profile URL</label>
          <input type="text" id="linkedin" name="linkedin" value={formData.linkedin} onChange={handleChange} required className={inputClass} />
        </div>
      </div>
      
      <div>
        <label htmlFor="objective" className={labelClass}>Career Objective</label>
        <textarea id="objective" name="objective" value={formData.objective} onChange={handleChange} required className={textAreaClass} placeholder="e.g., A highly motivated software engineer seeking..."></textarea>
      </div>
      <div>
        <label htmlFor="skills" className={labelClass}>Skills (comma-separated)</label>
        <input type="text" id="skills" name="skills" value={formData.skills} onChange={handleChange} required className={inputClass} placeholder="e.g., React, TypeScript, Node.js" />
      </div>
      <div>
        <label htmlFor="experience" className={labelClass}>Experience (Provide details on separate lines)</label>
        <textarea id="experience" name="experience" value={formData.experience} onChange={handleChange} required className={textAreaClass} placeholder="Company Name - Role (Date Range)\n- Achievement 1\n- Achievement 2"></textarea>
      </div>
      <div>
        <label htmlFor="education" className={labelClass}>Education</label>
        <textarea id="education" name="education" value={formData.education} onChange={handleChange} required className={textAreaClass} placeholder="Degree, University, Year"></textarea>
      </div>
      <div>
        <label htmlFor="projects" className={labelClass}>Projects</label>
        <textarea id="projects" name="projects" value={formData.projects} onChange={handleChange} required className={textAreaClass} placeholder="Project Title - Description"></textarea>
      </div>
       <div>
        <label htmlFor="otherDetails" className={labelClass}>Other Details (Optional)</label>
        <textarea id="otherDetails" name="otherDetails" value={formData.otherDetails} onChange={handleChange} className={textAreaClass} placeholder="e.g., Certifications, Awards, Languages..."></textarea>
      </div>

      <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white font-bold py-3 px-4 rounded-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105">
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </>
        ) : (
          <>
            <SparklesIcon />
            Generate Resume
          </>
        )}
      </button>
    </form>
  );
};