import React, { useEffect, useState, useRef } from 'react';
import { AppError } from '../../utils/errorHandler';

interface SoundFieldErrorProps {
  error: AppError | null;
  duration?: number;
  onDismiss?: () => void;
  className?: string;
  soundEnabled?: boolean;
}

const SoundFieldError: React.FC<SoundFieldErrorProps> = ({
  error,
  duration = 5000,
  onDismiss,
  className = '',
  soundEnabled = true
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(100);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (error) {
      setIsVisible(true);
      setProgress(100);

      if (soundEnabled) {
        audioRef.current = new Audio('/sounds/error.mp3');
        audioRef.current.play().catch(() => {
          // Ignore autoplay restrictions
        });
      }

      const startTime = Date.now();
      const timer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
        setProgress(remaining);

        if (remaining === 0) {
          clearInterval(timer);
          setIsVisible(false);
          if (onDismiss) {
            onDismiss();
          }
        }
      }, 10);

      return () => {
        clearInterval(timer);
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
      };
    }
  }, [error, duration, onDismiss, soundEnabled]);

  const handleDismiss = () => {
    setIsVisible(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (onDismiss) {
      onDismiss();
    }
  };

  if (!error || !isVisible) return null;

  return (
    <div
      className={`mt-1 text-sm text-red-600 animate-fade-in ${className}`}
      role="alert"
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center">
          <svg
            className="w-4 h-4 ml-1 animate-shake"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error.message}</span>
        </div>
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 text-current hover:opacity-75 focus:outline-none"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div className="h-0.5 bg-red-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-red-600 transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default SoundFieldError; 