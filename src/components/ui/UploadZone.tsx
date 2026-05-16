"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, FileText, CheckCircle } from "lucide-react";

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  isProcessing?: boolean;
  isComplete?: boolean;
  accept?: string;
  className?: string;
}

export default function UploadZone({
  onFileSelect,
  isProcessing = false,
  isComplete = false,
  accept = ".pdf,.doc,.docx",
  className = "",
}: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        setFileName(files[0].name);
        onFileSelect(files[0]);
      }
    },
    [onFileSelect]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        setFileName(files[0].name);
        onFileSelect(files[0]);
      }
    },
    [onFileSelect]
  );

  return (
    <div
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`relative cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 ${
        isComplete
          ? "border-success bg-success/5"
          : isProcessing
          ? "border-gold bg-gold-50"
          : isDragging
          ? "border-pine bg-pine-50 scale-[1.01]"
          : "border-border-light bg-sage-light hover:border-pine/30 hover:bg-sage"
      } ${className}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileInput}
        className="hidden"
      />

      <div className="flex flex-col items-center justify-center py-12 px-6">
        {isComplete ? (
          <>
            <CheckCircle className="mb-3 h-10 w-10 text-success" />
            <p className="font-display text-lg font-semibold text-success">
              Resume Parsed Successfully
            </p>
            {fileName && (
              <p className="mt-1 text-sm text-slate-muted">{fileName}</p>
            )}
          </>
        ) : isProcessing ? (
          <>
            {/* Scanning Animation */}
            <div className="relative mb-4 h-16 w-16">
              <FileText className="h-16 w-16 text-gold/50" />
              <div className="absolute inset-x-0 top-0 h-1 rounded-full bg-gradient-to-r from-transparent via-pine to-transparent animate-scan-line" />
            </div>
            <p className="font-display text-lg font-semibold text-pine">
              Document Extractor parsing skills, experience, and industry alignment...
            </p>
          </>
        ) : (
          <>
            <Upload
              className={`mb-3 h-10 w-10 transition-all duration-300 ${
                isDragging ? "text-pine scale-110" : "text-gold"
              }`}
            />
            <p className="font-display text-lg font-semibold text-pine">
              Drag &amp; Drop your Resume
            </p>
            <p className="mt-1 text-sm text-slate-muted">
              Watsonx will handle the rest. PDF, DOC, or DOCX accepted.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
