import React, { useEffect, useState, useRef } from 'react';
import { AppError } from '../../utils/errorHandler';

interface AccessibleFieldErrorProps {
  error: AppError | null;
  duration?: number;
  onDismiss?: () => void;
  className?: string;
  soundEnabled?: boolean;
  vibrationEnabled?: boolean;
  notificationEnabled?: boolean;
  theme?: 'light' | 'dark' | 'auto';
  ariaLabel?: string;
  ariaLive?: 'polite' | 'assertive' | 'off';
}

const AccessibleFieldError: React.FC<AccessibleFieldErrorProps> = ({
  error,
  duration = 5000,
  onDismiss,
  className = '',
  soundEnabled = true,
  vibrationEnabled = true,
  notificationEnabled = true,
  theme = 'auto',
  ariaLabel = 'خطای اعتبارسنجی',
  ariaLive = 'assertive'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(100);
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>(theme === 'auto' ? 'light' : theme);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setCurrentTheme(mediaQuery.matches ? 'dark' : 'light');

      const handler = (e: MediaQueryListEvent) => {
        setCurrentTheme(e.matches ? 'dark' : 'light');
      };

      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      setCurrentTheme(theme);
    }
  }, [theme]);

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

      if (vibrationEnabled && navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }

      if (notificationEnabled && 'Notification' in window) {
        if (Notification.permission === 'granted') {
          new Notification('خطا', {
            body: error.message,
            icon: '/images/error-icon.png'
          });
        } else if (Notification.permission !== 'denied') {
          Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
              new Notification('خطا', {
                body: error.message,
                icon: '/images/error-icon.png'
              });
            }
          });
        }
      }

      // Focus the error message for screen readers
      if (errorRef.current) {
        errorRef.current.focus();
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
  }, [error, duration, onDismiss, soundEnabled, vibrationEnabled, notificationEnabled]);

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleDismiss();
    }
  };

  if (!error || !isVisible) return null;

  const themeClasses = {
    light: {
      container: 'bg-red-50 text-red-800 border-red-200',
      icon: 'text-red-600',
      progress: {
        track: 'bg-red-200',
        bar: 'bg-red-600'
      }
    },
    dark: {
      container: 'bg-red-900/50 text-red-200 border-red-700',
      icon: 'text-red-400',
      progress: {
        track: 'bg-red-800',
        bar: 'bg-red-500'
      }
    }
  };

  const currentThemeClasses = themeClasses[currentTheme];

  return (
    <div
      ref={errorRef}
      className={`mt-1 text-sm rounded-lg border p-3 animate-fade-in ${currentThemeClasses.container} ${className}`}
      role="alert"
      aria-live={ariaLive}
      aria-label={ariaLabel}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center">
          <svg
            className={`w-4 h-4 ml-1 animate-shake ${currentThemeClasses.icon}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
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
          className="flex-shrink-0 text-current hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current rounded"
          aria-label="بستن پیام خطا"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
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
      <div
        className={`h-0.5 rounded-full overflow-hidden ${currentThemeClasses.progress.track}`}
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`h-full transition-all duration-100 ease-linear ${currentThemeClasses.progress.bar}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default AccessibleFieldError; 