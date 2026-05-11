/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CandidateAnalysis {
  candidateSummary: string;
  keyTechnicalSkills: string[];
  missingSkills: string[];
  seniorityEstimation: 'Junior' | 'Mid' | 'Senior' | 'Lead' | 'Executive' | string;
  matchScore: number; // 1-100
  mainStrengths: string[];
  mainConcerns: string[];
  suggestedScreeningQuestions: string[];
  finalRecommendation: string;
}

export type AnalysisState = 'idle' | 'analyzing' | 'completed' | 'error';
