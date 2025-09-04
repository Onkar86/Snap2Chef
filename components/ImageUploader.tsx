import React, { useState, useCallback } from 'react';
import { UploadIcon } from '../assets/icons';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageUpload(e.dataTransfer.files[0]);
    }
  }, [onImageUpload]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  
  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${isDragging ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/50'}`}
    >
      <input
        type="file"
        id="file-upload"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        accept="image/png, image/jpeg, image/webp"
        onChange={handleFileChange}
      />
      <label htmlFor="file-upload" className="cursor-pointer">
        <div className="flex flex-col items-center justify-center">
          <UploadIcon className={`w-12 h-12 mb-4 transition-colors ${isDragging ? 'text-emerald-500' : 'text-slate-400 dark:text-slate-500'}`} />
          <p className="text-slate-600 dark:text-slate-300 font-semibold">
            <span className="text-emerald-500">Click to upload</span> or drag and drop
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">PNG, JPG, or WEBP</p>
        </div>
      </label>
    </div>
  );
};

export default ImageUploader;