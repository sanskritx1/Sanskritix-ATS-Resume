import { GoogleGenAI, Type } from "@google/genai";
import type { FormData, ResumeData } from '../types';

const buildPrompt = (formData: FormData): string => {
  return `
You are an expert ATS resume writer and career coach.
Generate a professional and ATS-friendly resume in structured JSON format from the following user details.
Keep the tone concise, achievement-oriented, and recruiter-friendly.
Focus on measurable impact, clear formatting, and relevant industry keywords.
Make sure the resume can pass Applicant Tracking System (ATS) filters.

---

### Input Data:
Full Name: ${formData.fullName}
Email: ${formData.email}
Phone: ${formData.phone}
LinkedIn: ${formData.linkedin}
Education:
${formData.education}
Experience:
${formData.experience}
Skills:
${formData.skills}
Career Objective:
${formData.objective}
Projects:
${formData.projects}
Other Details:
${formData.otherDetails}

---

### Output Format (Return in JSON only):
You must respond with only a valid JSON object that adheres to the following structure. Do not include any other text, markdown formatting, or explanations before or after the JSON object.

{
  "summary": "Professional summary paragraph highlighting key strengths and goals.",
  "education": [
    {
      "degree": "Degree Name",
      "institution": "College/University Name",
      "year": "YYYY",
      "details": "Optional achievements or coursework"
    }
  ],
  "experience": [
    {
      "company": "Company/Organization Name",
      "role": "Role/Position",
      "duration": "Start - End",
      "achievements": [
        "Achievement 1 with measurable impact",
        "Achievement 2 with action verbs"
      ]
    }
  ],
  "skills": ["Skill 1", "Skill 2", "Skill 3"],
  "projects": [
    {
      "title": "Project Title",
      "description": "Brief summary focusing on impact, technologies, and outcomes."
    }
  ],
  "ats_keywords": ["list", "of", "important", "ATS", "keywords"],
  "ats_score": "Give a score between 70-100 based on keyword richness and readability",
  "improvement_suggestions": [
    "Suggestion 1",
    "Suggestion 2"
  ],
  "additional_information": [
      "Optional: Certification Name (Year)",
      "Optional: Award Name (Organization, Year)"
  ]
}

---

### Rules:
1. Return output strictly in valid JSON. If the 'Other Details' input is empty, return an empty array for 'additional_information'.
2. Keep resume professional and formatted for corporate recruiters.
3. Use bullet-style phrases for achievements.
4. Avoid unnecessary introduction lines.
5. Ensure output is less than 2000 words.
6. Do not include Markdown or extra text outside JSON.
  `;
};

export const generateResume = async (formData: FormData): Promise<ResumeData> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = buildPrompt(formData);
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
    });

    const textResponse = response.text.trim();
    
    // Sometimes the model might still wrap the JSON in markdown, so we clean it.
    const jsonString = textResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');

    const parsedData: ResumeData = JSON.parse(jsonString);
    return parsedData;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate resume from AI: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while generating the resume.");
  }
};