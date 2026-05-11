/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { motion } from 'motion/react';

interface ResumeDropzoneProps {
  onContentChange: (content: string) => void;
}

export function ResumeDropzone({ onContentChange }: ResumeDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [manualText, setManualText] = useState('');

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = async (file: File) => {
    setFileName(file.name);
    // In a real app, we'd use a PDF parser here. 
    // For this prototype, we'll read as text which works for .txt and some .doc layouts
    // but the user can always paste if the file reading fails.
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setManualText(text);
      onContentChange(text);
    };
    reader.readAsText(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setManualText(val);
    onContentChange(val);
    if (val && fileName) setFileName(null);
  };

  const clearFile = () => {
    setFileName(null);
    setManualText('');
    onContentChange('');
  };

  return (
    <div className="space-y-4">
      <label className="label-ats">Candidate Resume</label>
      
      {!fileName ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-xl p-8 transition-all flex flex-col items-center justify-center gap-3 group bg-slate-50/50 ${
            isDragging ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200'
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
            <Upload className="w-5 h-5 text-slate-400 group-hover:text-blue-500" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-slate-700">
              Drag & drop resume file here
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Supports .txt (PDF/Docx please paste content below)
            </p>
          </div>
          <input
            type="file"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleFileInput}
          />
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-4 glass-card border-blue-100 bg-blue-50/30"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">{fileName}</p>
              <p className="text-xs text-slate-400">Ready for analysis</p>
            </div>
          </div>
          <button 
            onClick={clearFile}
            className="p-1.5 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </motion.div>
      )}

      <div className="relative">
        <textarea
          value={manualText}
          onChange={handleTextChange}
          placeholder="Or paste resume content directly here..."
          className="ats-input min-h-[200px] resize-none"
        />
        <div className="absolute top-3 right-3 opacity-20 pointer-events-none">
          <FileText className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
