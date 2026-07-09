"use client";

import React, { useState, useRef } from "react";
import { Upload, X, RefreshCw, FileImage, AlertCircle } from "lucide-react";
import { uploadImageToBlob, deleteImageFromBlob } from "@/lib/blob";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface UploadingFile {
  id: string;
  name: string;
  progress: number;
  error: string | null;
  file: File;
}

interface ImageUploadAreaProps {
  value?: string | string[]; // Single URL or Array of URLs
  onChange: (value: string | string[]) => void;
  folder: "packages" | "gallery" | "settings" | "fleet";
  multiple?: boolean;
  className?: string;
}

function generateFileId(file: File): string {
  return `${file.name}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
}

export function ImageUploadArea({
  value,
  onChange,
  folder,
  multiple = false,
  className,
}: ImageUploadAreaProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Parse current values
  const currentImages = multiple
    ? Array.isArray(value)
      ? value
      : value
      ? [value]
      : []
    : typeof value === "string" && value
    ? [value]
    : [];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFiles(Array.from(e.target.files));
    }
  };

  const processFiles = (files: File[]) => {
    const validFiles: File[] = [];
    
    for (const file of files) {
      // Validate file extension/MIME
      const extension = file.name.split(".").pop()?.toLowerCase();
      const validExtensions = ["jpg", "jpeg", "png", "webp"];
      const validMime = ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type);
      
      if (!extension || !validExtensions.includes(extension) || !validMime) {
        toast.error(`Unsupported format: ${file.name}. Allowed: JPG, JPEG, PNG, WEBP`);
        continue;
      }

      // Max size limit 5MB
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`File too large: ${file.name}. Limit is 5MB.`);
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    if (!multiple) {
      // For single upload, just take the first valid file
      startUpload(validFiles[0]);
    } else {
      // For multiple uploads, queue them all
      validFiles.forEach(file => startUpload(file));
    }
  };

  const startUpload = async (file: File) => {
    const fileId = generateFileId(file);
    const newUpload: UploadingFile = {
      id: fileId,
      name: file.name,
      progress: 0,
      error: null,
      file,
    };

    setUploadingFiles(prev => [...prev, newUpload]);

    try {
      const url = await uploadImageToBlob(file, folder, (progress) => {
        setUploadingFiles(prev =>
          prev.map(f => (f.id === fileId ? { ...f, progress } : f))
        );
      });

      // Remove from uploading queue
      setUploadingFiles(prev => prev.filter(f => f.id !== fileId));

      // Update parent value
      if (multiple) {
        onChange([...currentImages, url]);
      } else {
        onChange(url);
      }
      
      toast.success(`${file.name} uploaded successfully!`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Upload failed";
      setUploadingFiles(prev =>
        prev.map(f => (f.id === fileId ? { ...f, error: errorMessage } : f))
      );
      toast.error(`Failed to upload ${file.name}: ${errorMessage}`);
    }
  };

  const handleRetry = (uploadingFile: UploadingFile) => {
    // Remove current failed record
    setUploadingFiles(prev => prev.filter(f => f.id !== uploadingFile.id));
    // Start upload again
    startUpload(uploadingFile.file);
  };

  const handleCancelUploading = (fileId: string) => {
    setUploadingFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleRemoveImage = async (url: string) => {
    const toastId = toast.loading("Removing image...");
    try {
      await deleteImageFromBlob(url);
      
      if (multiple) {
        onChange(currentImages.filter(img => img !== url));
      } else {
        onChange("");
      }
      
      toast.success("Image removed successfully", { id: toastId });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to remove image", { id: toastId });
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Drop Zone Area */}
      {(multiple || currentImages.length === 0) && (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "relative border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 min-h-[160px] text-center",
            dragActive
              ? "border-accent-primary bg-accent-primary/10 scale-[0.99] shadow-inner"
              : "border-border bg-surface/30 backdrop-blur-sm hover:border-accent-primary/50 hover:bg-surface/50"
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple={multiple}
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          
          <div className="w-12 h-12 rounded-2xl bg-accent-primary/10 flex items-center justify-center text-accent-primary mb-4">
            <Upload size={22} className="animate-pulse" />
          </div>

          <p className="font-display font-semibold text-ink text-base mb-1">
            Drag & drop your {multiple ? "images" : "image"} here
          </p>
          <p className="text-ink-muted text-xs font-medium">
            Supports JPEG, PNG, WEBP up to 5MB. Or <span className="text-accent-primary underline">browse files</span>.
          </p>
        </div>
      )}

      {/* Progressing uploads */}
      <AnimatePresence>
        {uploadingFiles.length > 0 && (
          <div className="space-y-3">
            {uploadingFiles.map(file => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center gap-4 p-4 rounded-2xl bg-surface border border-border/50"
              >
                <div className="w-10 h-10 rounded-xl bg-accent-primary/10 flex items-center justify-center text-accent-primary shrink-0">
                  <FileImage size={20} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-medium text-ink truncate">{file.name}</p>
                    <span className="text-xs font-bold text-accent-primary tabular-nums">
                      {file.error ? "Failed" : `${Math.round(file.progress)}%`}
                    </span>
                  </div>

                  {file.error ? (
                    <p className="text-xs text-error font-medium flex items-center gap-1">
                      <AlertCircle size={12} /> {file.error}
                    </p>
                  ) : (
                    <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent-primary rounded-full transition-all duration-300"
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {file.error ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleRetry(file)}
                        className="p-1.5 rounded-lg bg-accent-primary/10 text-accent-primary hover:bg-accent-primary/20 transition-colors"
                        title="Retry upload"
                      >
                        <RefreshCw size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCancelUploading(file.id)}
                        className="p-1.5 rounded-lg bg-error/10 text-error hover:bg-error/20 transition-colors"
                        title="Remove"
                      >
                        <X size={14} />
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleCancelUploading(file.id)}
                      className="p-1.5 rounded-lg text-ink-muted hover:bg-border transition-colors"
                      title="Cancel"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Uploaded Previews */}
      {currentImages.length > 0 && (
        <div
          className={cn(
            multiple
              ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
              : "max-w-md"
          )}
        >
          {currentImages.map((url, index) => (
            <div
              key={url}
              className="group relative rounded-3xl overflow-hidden border border-border aspect-video bg-surface shadow-sm hover:shadow-md transition-all duration-300"
            >
              {/* Fallback support using normal img tag (with unoptimized tag internally or Next.js Image component) */}
              <img
                src={url}
                alt={`Uploaded ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://placehold.co/600x400/FFE5B4/A63A1E?text=Error+Loading";
                }}
              />
              
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handleRemoveImage(url)}
                  className="w-9 h-9 rounded-full bg-error text-white flex items-center justify-center hover:scale-110 transition-transform duration-300"
                  title="Remove Image"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
