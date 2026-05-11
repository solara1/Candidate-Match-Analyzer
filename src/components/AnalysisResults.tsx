/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Brain, 
  Lightbulb, 
  HelpCircle, 
  Award,
  Zap,
  Target
} from 'lucide-react';
import { motion } from 'motion/react';
import { CandidateAnalysis } from '../types';

interface AnalysisResultsProps {
  analysis: CandidateAnalysis;
}

export function AnalysisResults({ analysis }: AnalysisResultsProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 border-emerald-200 bg-emerald-50';
    if (score >= 50) return 'text-amber-600 border-amber-200 bg-amber-50';
    return 'text-rose-600 border-rose-200 bg-rose-50';
  };

  const getScoreCircleColor = (score: number) => {
    if (score >= 80) return 'stroke-emerald-500';
    if (score >= 50) return 'stroke-amber-500';
    return 'stroke-rose-500';
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header Stat Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="col-span-2 glass-card p-6 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-4 h-4 text-blue-500" />
              <span className="label-ats mb-0">Candidate Executive Summary</span>
            </div>
            <p className="text-lg font-medium text-slate-800 leading-relaxed">
              {analysis.candidateSummary}
            </p>
          </div>
          <div className="flex gap-4 mt-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200">
              <Award className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                {analysis.seniorityEstimation}
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-100">
              <Target className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                {analysis.finalRecommendation}
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-6 flex flex-col items-center justify-center gap-4 text-center relative overflow-hidden"
        >
          <div className="relative w-32 h-32">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="58"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-slate-100"
              />
              <motion.circle
                cx="64"
                cy="64"
                r="58"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray="364.4"
                initial={{ strokeDashoffset: 364.4 }}
                animate={{ strokeDashoffset: 364.4 - (364.4 * analysis.matchScore) / 100 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                strokeLinecap="round"
                className={getScoreCircleColor(analysis.matchScore)}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-slate-900 leading-none">
                {analysis.matchScore}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                Match Score
              </span>
            </div>
          </div>
          <div className={`px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-widest ${getScoreColor(analysis.matchScore)}`}>
            {analysis.matchScore >= 80 ? 'Ideal Candidate' : analysis.matchScore >= 50 ? 'Strong Potential' : 'Review Closely'}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Skills Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 space-y-6"
        >
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-emerald-500" />
              <h3 className="label-ats mb-0">Technical Assets</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {analysis.keyTechnicalSkills.map((skill, i) => (
                <span 
                  key={i} 
                  className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-4 h-4 text-rose-500" />
              <h3 className="label-ats mb-0">Missing Core Skills</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {analysis.missingSkills.length > 0 ? (
                analysis.missingSkills.map((skill, i) => (
                  <span 
                    key={i} 
                    className="px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 border border-rose-100 text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400 italic">No missing critical skills detected.</span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Strengths & Concerns */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 gap-6"
        >
          <div className="glass-card p-6 border-l-4 border-l-emerald-500">
            <h3 className="flex items-center gap-2 font-bold text-slate-800 text-sm mb-4">
              <Lightbulb className="w-4 h-4 text-emerald-500" />
              Main Strengths
            </h3>
            <ul className="space-y-3">
              {analysis.mainStrengths.map((str, i) => (
                <li key={i} className="flex gap-3 text-sm text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  {str}
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-card p-6 border-l-4 border-l-amber-500">
            <h3 className="flex items-center gap-2 font-bold text-slate-800 text-sm mb-4">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              Key Concerns
            </h3>
            <ul className="space-y-3">
              {analysis.mainConcerns.map((con, i) => (
                <li key={i} className="flex gap-3 text-sm text-slate-600">
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  {con}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>

      {/* Questions Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <HelpCircle className="w-4 h-4 text-purple-500" />
          <h3 className="label-ats mb-0">Recommended Screening Questions</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analysis.suggestedScreeningQuestions.map((q, i) => (
            <div key={i} className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex gap-3 group hover:border-purple-200 transition-colors">
              <span className="text-purple-400 font-bold group-hover:text-purple-600 transition-colors">0{i+1}</span>
              <p className="text-sm text-slate-700 leading-snug">{q}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
