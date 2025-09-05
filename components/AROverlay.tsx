import React, { useEffect, useRef, useState } from 'react';
// FIX: Replace missing TimerIcon with Timer from lucide-react
import { Timer } from 'lucide-react';

interface AROverlayProps {
  recipeName: string;
  instruction: string;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onExit: () => void;
}

const ARVisualCues: React.FC<{ instruction: string }> = ({ instruction }) => {
    const [timer, setTimer] = useState<number | null>(null);

    useEffect(() => {
        const timeMatch = instruction.match(/(\d+)\s*(minutes|minute|seconds|second)/i);
        if (timeMatch) {
            let seconds = parseInt(timeMatch[1], 10);
            if (timeMatch[2].startsWith('minute')) {
                seconds *= 60;
            }
            setTimer(seconds);
        } else {
            setTimer(null);
        }
    }, [instruction]);

    useEffect(() => {
        if (timer === null || timer <= 0) return;
        const interval = setInterval(() => {
            setTimer(prev => (prev ? prev - 1 : null));
        }, 1000);
        return () => clearInterval(interval);
    }, [timer]);

    if (timer !== null && timer > 0) {
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;
        return (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm p-6 rounded-2xl flex flex-col items-center gap-2 border border-white/20">
                {/* FIX: Use Timer icon from lucide-react */}
                <Timer className="w-12 h-12 text-emerald-400" />
                <p className="text-5xl font-bold tracking-wider">{`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`}</p>
                <p className="text-sm text-white/80">Time Remaining</p>
            </div>
        );
    }
    return null;
}

const AROverlay: React.FC<AROverlayProps> = ({ recipeName, instruction, currentStep, totalSteps, onNext, onPrev, onExit }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    const startCamera = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } else {
          setError('Camera access is not supported by your browser.');
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError('Could not access camera. Please check permissions.');
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black text-white z-50">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />
       <div className="absolute inset-0 bg-black/40" />

      {error && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-800/80 p-4 rounded-lg">
            <p>{error}</p>
        </div>
      )}

      <ARVisualCues instruction={instruction} />

      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start bg-gradient-to-b from-black/60 to-transparent">
        <div>
            <h2 className="text-2xl font-bold">{recipeName}</h2>
            <div className="flex items-center gap-2 mt-1">
                 <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse-slow"></div>
                 <span className="text-sm font-medium">AR MODE LIVE</span>
            </div>
        </div>
        <button onClick={onExit} className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-white/30 transition-colors">
          Exit AR
        </button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
        <div className="max-w-4xl mx-auto">
            <div className="bg-black/40 backdrop-blur-md p-6 rounded-xl border border-white/20">
                 <p className="text-2xl text-center leading-relaxed">{instruction}</p>
            </div>
            <div className="mt-6 flex items-center justify-between">
                <button onClick={onPrev} disabled={currentStep === 0} className="px-6 py-3 bg-white/20 rounded-lg disabled:opacity-50 hover:bg-white/30 transition-colors">
                    Previous
                </button>
                <div className="text-sm font-medium">
                    Step {currentStep + 1} of {totalSteps}
                </div>
                <button onClick={onNext} disabled={currentStep === totalSteps - 1} className="px-6 py-3 bg-white/20 rounded-lg disabled:opacity-50 hover:bg-white/30 transition-colors">
                    Next
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AROverlay;