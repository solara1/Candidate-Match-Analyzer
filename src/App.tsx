/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  FileSearch, 
  Sparkles, 
  ChevronRight, 
  Loader2, 
  ArrowLeft,
  AlertTriangle,
  Layers,
  LayoutDashboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ResumeDropzone } from './components/ResumeDropzone';
import { AnalysisResults } from './components/AnalysisResults';
import { analyzeCandidate } from './services/geminiService';
import { CandidateAnalysis, AnalysisState } from './types';

export default function App() {
  const [jd, setJd] = useState('');
  const [resume, setResume] = useState('');
  const [state, setState] = useState<AnalysisState>('idle');
  const [analysis, setAnalysis] = useState<CandidateAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!jd.trim() || !resume.trim()) return;

    setState('analyzing');
    setError(null);

    try {
      const result = await analyzeCandidate(jd, resume);
      setAnalysis(result);
      setState('completed');
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred during analysis.');
      setState('error');
    }
  };

  const reset = () => {
    setState('idle');
    setAnalysis(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Navbar */}
      <nav className="h-16 border-b border-slate-200 bg-white sticky top-0 z-50 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-md rotate-3">
            BM
          </div>
          <span className="font-bold text-slate-800 tracking-tight">Candidate Match Analyzer</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex gap-4">
            <span className="text-sm font-semibold text-blue-600 border-b-2 border-blue-600 pb-1">Pipeline</span>
            <span className="text-sm font-medium text-slate-400 hover:text-slate-600 cursor-pointer">Postings</span>
            <span className="text-sm font-medium text-slate-400 hover:text-slate-600 cursor-pointer">Reporting</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
            <LayoutDashboard className="w-4 h-4 text-slate-500" />
          </div>
        </div>
      </nav>

      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-10">
        <AnimatePresence mode="wait">
          {state === 'idle' || state === 'error' || state === 'analyzing' ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Context Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-slate-200">
                <div>
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    New Analysis <Layers className="w-6 h-6 text-blue-500" />
                  </h1>
                <p className="text-slate-500 font-medium mt-1">Match candidates to your open opportunities with precision AI.</p>
                </div>
                
                <button
                  onClick={handleAnalyze}
                  disabled={!jd.trim() || !resume.trim() || state === 'analyzing'}
                  className="btn-primary flex items-center gap-2 h-12 px-6"
                >
                  {state === 'analyzing' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>Analyze Candidate</span>
                      <Sparkles className="w-4 h-4 text-white/80" />
                    </>
                  )}
                </button>
              </div>

              {error && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex gap-3 text-rose-800">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <div className="text-sm font-medium">{error}</div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                <div className="space-y-4">
                  <label htmlFor="jd" className="label-ats">Job Description</label>
                  <div className="relative group">
                    <textarea
                      id="jd"
                      value={jd}
                      onChange={(e) => setJd(e.target.value)}
                      placeholder="Paste the full job description here, including requirements, responsibilities, and qualifications..."
                      className="ats-input min-h-[480px] font-sans leading-relaxed group-hover:border-slate-300 transition-colors"
                    />
                    <div className="absolute bottom-4 right-4 pointer-events-none transition-opacity opacity-20 group-hover:opacity-40">
                      <FileSearch className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <ResumeDropzone onContentChange={setResume} />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between gap-4 pb-2 border-b border-slate-200">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={reset}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                  >
                    <ArrowLeft className="w-5 h-5 text-slate-600" />
                  </button>
                  <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Analysis Report</h1>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Generated via Gemini 3 Flash</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button className="px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all">
                    Export PDF
                  </button>
                  <button className="btn-primary text-sm flex items-center gap-2">
                    Accept <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {analysis && <AnalysisResults analysis={analysis} />}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Info */}
      <footer className="h-12 border-t border-slate-200 bg-slate-50/50 px-6 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        <div className="flex gap-4">
          <span>Version 1.0.4-Beta</span>
          <span>System Status: Optimal</span>
        </div>
        <div>
          © 2026 Candidate Match Analyzer — Enterprise AI Core
        </div>
      </footer>

      {/* Loading Overlay */}
      <AnimatePresence>
        {state === 'analyzing' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="glass-card p-10 max-w-sm w-full text-center flex flex-col items-center gap-6 shadow-2xl"
            >
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
                <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-blue-500 opacity-50" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 mb-2">Analyzing Candidate Profile</h2>
                <p className="text-sm text-slate-500 font-medium">Gemini is cross-referencing experience, skills, and cultural fit markers with your requirements.</p>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className="w-1/2 h-full bg-blue-600"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
