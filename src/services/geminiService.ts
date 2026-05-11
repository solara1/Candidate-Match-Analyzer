/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import { CandidateAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function analyzeCandidate(jobDescription: string, resumeText: string): Promise<CandidateAnalysis> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `
      Analyze the following candidate resume against the provided job description.
      
      Job Description:
      ${jobDescription}
      
      Candidate Resume:
      ${resumeText}
    `,
    config: {
      systemInstruction: "You are an expert recruiter and technical hiring manager. Provide a detailed, objective analysis of how well the candidate matches the job description. Return your response in the specified JSON format.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          candidateSummary: { type: Type.STRING, description: "A high-level summary of the candidate's profile." },
          keyTechnicalSkills: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "List of technical skills the candidate possesses that are relevant to the job." 
          },
          missingSkills: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Required or preferred skills mentioned in the JD that are not evident in the resume." 
          },
          seniorityEstimation: { type: Type.STRING, description: "Estimated seniority level based on experience." },
          matchScore: { type: Type.NUMBER, description: "A score from 1 to 100 indicating the fit." },
          mainStrengths: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Top 3-5 reasons why this candidate is a good fit." 
          },
          mainConcerns: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Any potential red flags or gaps in experience." 
          },
          suggestedScreeningQuestions: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Targeted questions to ask in an initial screen to verify skills." 
          },
          finalRecommendation: { type: Type.STRING, description: "Your final advice (e.g., 'Strong Hire', 'Proceed with Caution', 'No Fit')." },
        },
        required: [
          "candidateSummary", "keyTechnicalSkills", "missingSkills", 
          "seniorityEstimation", "matchScore", "mainStrengths", 
          "mainConcerns", "suggestedScreeningQuestions", "finalRecommendation"
        ],
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI service.");
  
  try {
    return JSON.parse(text) as CandidateAnalysis;
  } catch (error) {
    console.error("Failed to parse Gemini response:", text);
    throw new Error("The AI provided an invalid response format.");
  }
}
