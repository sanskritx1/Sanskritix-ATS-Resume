import React, { useState, useCallback } from 'react';
import { ResumeForm } from './components/ResumeForm';
import { ResumeDisplay } from './components/ResumeDisplay';
import { generateResume } from './services/geminiService';
import { ResumeData, FormData } from './types';

function App() {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [currentFormData, setCurrentFormData] = useState<FormData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateResume = useCallback(async (formData: FormData) => {
    setIsLoading(true);
    setError(null);
    setResumeData(null);
    setCurrentFormData(formData); // Keep track of the submitted form data
    try {
      const data = await generateResume(formData);
      setResumeData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans">
      <main className="container mx-auto px-4 py-8">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-500">
            AI-Powered ATS Resume Builder
          </h1>
          <p className="mt-4 text-lg text-slate-400 max-w-3xl mx-auto">
            Enter your details and let our AI craft a professional, ATS-friendly resume tailored for recruiters.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="bg-slate-800/50 rounded-xl p-6 shadow-2xl backdrop-blur-sm border border-slate-700">
            <ResumeForm onGenerate={handleGenerateResume} isLoading={isLoading} />
          </div>

          <div className="sticky top-8 bg-slate-800/50 rounded-xl shadow-2xl backdrop-blur-sm border border-slate-700 lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto">
             <ResumeDisplay resumeData={resumeData} isLoading={isLoading} error={error} currentFormData={currentFormData} />
          </div>
        </div>

        <footer className="text-center mt-12 text-slate-500">
            <p>Powered by Google Gemini. Designed by a World-Class Senior Frontend Engineer.</p>
        </footer>
      </main>
    </div>
  );
}

export default App;