import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, Camera } from 'lucide-react';

interface UploadBoxProps {
  onImageUpload: (file: File) => void;
}

const UploadBox: React.FC<UploadBoxProps> = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  // FIX: Change event type from HTMLDivElement to HTMLLabelElement
  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageUpload(e.dataTransfer.files[0]);
    }
  }, [onImageUpload]);

  // FIX: Change event type from HTMLDivElement to HTMLLabelElement
  const handleDragEvents = useCallback((e: React.DragEvent<HTMLLabelElement>, dragging: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(dragging);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <label
        htmlFor="file-upload"
        onDrop={handleDrop}
        onDragOver={(e) => handleDragEvents(e, true)}
        onDragEnter={(e) => handleDragEvents(e, true)}
        onDragLeave={(e) => handleDragEvents(e, false)}
        className={`md:col-span-3 relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer flex flex-col items-center justify-center
        ${isDragging 
            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30' 
            : 'border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm'
        }`}
      >
        <input
          type="file"
          id="file-upload"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange}
        />
        <motion.div whileHover={{ scale: 1.05 }}>
            <UploadCloud className={`w-12 h-12 mb-4 transition-colors ${isDragging ? 'text-emerald-500' : 'text-slate-400 dark:text-slate-500'}`} />
            <p className="text-slate-600 dark:text-slate-300 font-semibold">
              <span className="text-emerald-500">Click to upload</span> or drag and drop
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">PNG, JPG, or WEBP</p>
        </motion.div>
      </label>

       <label
        htmlFor="camera-upload"
        className="md:col-span-2 relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer flex flex-col items-center justify-center border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
       >
         <input
          type="file"
          id="camera-upload"
          capture="environment"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept="image/*"
          onChange={handleFileChange}
        />
        <motion.div whileHover={{ scale: 1.05 }}>
             <Camera className="w-12 h-12 mb-4 text-slate-400 dark:text-slate-500" />
            <p className="text-slate-600 dark:text-slate-300 font-semibold">
              Use <span className="text-emerald-500">Camera</span>
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Snap a photo of your food</p>
        </motion.div>
       </label>
    </div>
  );
};

export default UploadBox;