import React, { useRef, useState, useCallback } from 'react';
import { Upload, X, ImageIcon, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface PhotoUploadProps {
  value?: string; // base64 string
  onChange: (base64: string | undefined) => void;
  className?: string;
}

const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

export default function PhotoUpload({ value, onChange, className }: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = useCallback((file: File) => {
    setError(null);
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Only JPEG and PNG images are accepted.');
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setError(`File size must be under ${MAX_SIZE_MB}MB.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      // Strip the data URL prefix, keep only base64 content
      const base64 = result.split(',')[1];
      onChange(base64);
    };
    reader.readAsDataURL(file);
  }, [onChange]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    // Reset input so same file can be re-selected
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(undefined);
    setError(null);
  };

  return (
    <div className={cn('space-y-2', className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png"
        className="hidden"
        onChange={handleFileChange}
      />

      {value ? (
        <div className="relative group rounded-lg overflow-hidden border border-teal-500/30 bg-accent/20"
          style={{ boxShadow: '0 0 0 1px oklch(0.72 0.18 195 / 0.2), 0 4px 16px oklch(0.72 0.18 195 / 0.08)' }}
        >
          <img
            src={`data:image/jpeg;base64,${value}`}
            alt="Infrastructure photo"
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-teal-500/20 border border-teal-500/40 text-teal text-xs font-mono hover:bg-teal-500/30 transition-colors"
            >
              <Upload size={12} />
              Replace
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-mono hover:bg-red-500/30 transition-colors"
            >
              <X size={12} />
              Remove
            </button>
          </div>
          <div className="absolute top-2 right-2">
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-full bg-background/80 border border-border text-muted-foreground hover:text-red-400 transition-colors"
            >
              <X size={12} />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            'flex flex-col items-center justify-center gap-3 h-40 rounded-lg border-2 border-dashed cursor-pointer transition-all',
            isDragging
              ? 'border-teal-500/70 bg-teal-500/10'
              : 'border-border hover:border-teal-500/40 hover:bg-teal-500/5 bg-accent/10'
          )}
          style={isDragging ? { boxShadow: '0 0 0 1px oklch(0.72 0.18 195 / 0.3), 0 4px 20px oklch(0.72 0.18 195 / 0.15)' } : {}}
        >
          <div className={cn(
            'p-3 rounded-full transition-colors',
            isDragging ? 'bg-teal-500/20' : 'bg-accent/30'
          )}>
            <ImageIcon size={24} className={isDragging ? 'text-teal' : 'text-muted-foreground'} />
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              <span className="text-teal font-medium">Click to upload</span> or drag & drop
            </p>
            <p className="text-xs text-muted-foreground mt-1">JPEG, PNG up to {MAX_SIZE_MB}MB</p>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-red-400">
          <AlertCircle size={12} />
          {error}
        </div>
      )}
    </div>
  );
}
