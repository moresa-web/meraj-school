import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { AppError } from '../../utils/errorTypes';

interface TestableFieldErrorProps {
  error: AppError | null;
  duration?: number;
  onDismiss?: () => void;
  className?: string;
  sound?: boolean;
  vibration?: boolean;
  notification?: boolean;
  theme?: 'light' | 'dark';
  ariaLabel?: string;
  ariaLive?: 'polite' | 'assertive' | 'off';
  direction?: 'ltr' | 'rtl';
  testId?: string;
}

export const TestableFieldError: React.FC<TestableFieldErrorProps> = ({
  error,
  duration = 5000,
  onDismiss,
  className = '',
  sound = false,
  vibration = false,
  notification = false,
  theme = 'light',
  ariaLabel = 'Error message',
  ariaLive = 'assertive',
  direction = 'ltr',
  testId = 'field-error'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(100);
  const timerRef = useRef<NodeJS.Timeout>();
  const progressRef = useRef<NodeJS.Timeout>();
  const { t } = useTranslation();

  useEffect(() => {
    if (error) {
      setIsVisible(true);
      setProgress(100);

      // Play sound if enabled
      if (sound) {
        const audio = new Audio('/sounds/error.mp3');
        audio.play().catch(console.error);
      }

      // Trigger vibration if enabled
      if (vibration && navigator.vibrate) {
        navigator.vibrate(200);
      }

      // Show notification if enabled
      if (notification && window.Notification) {
        if (window.Notification.permission === 'granted') {
          new window.Notification(t('error.notification.title'), {
            body: error.message,
            icon: '/icons/error.png'
          });
        } else if (window.Notification.permission !== 'denied') {
          window.Notification.requestPermission();
        }
      }

      // Start progress bar
      const progressInterval = duration / 100;
      progressRef.current = setInterval(() => {
        setProgress(prev => Math.max(0, prev - 1));
      }, progressInterval);

      // Set auto-dismiss timer
      timerRef.current = setTimeout(() => {
        setIsVisible(false);
        onDismiss?.();
      }, duration);

      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        if (progressRef.current) clearInterval(progressRef.current);
      };
    }
  }, [error, duration, sound, vibration, notification, onDismiss, t]);

  if (!error || !isVisible) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleDismiss();
    }
  };

  const themeClasses = {
    light: 'bg-red-50 text-red-800 border-red-200',
    dark: 'bg-red-900 text-red-200 border-red-700'
  };

  const directionClasses = {
    ltr: 'text-left',
    rtl: 'text-right'
  };

  return (
    <div
      role="alert"
      aria-label={ariaLabel}
      aria-live={ariaLive}
      dir={direction}
      data-testid={testId}
      className={`
        fixed bottom-4 right-4 p-4 rounded-lg shadow-lg
        border border-solid
        ${themeClasses[theme]}
        ${directionClasses[direction]}
        ${className}
        transition-all duration-300 ease-in-out
        transform translate-y-0 opacity-100
      `}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="flex items-start gap-3">
        <svg
          className="w-5 h-5 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div className="flex-1">
          <p className="text-sm font-medium">{error.message}</p>
        </div>
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 p-1 rounded-full hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
          aria-label={t('common.dismiss')}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div className="mt-2 h-1 bg-red-200 dark:bg-red-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-red-500 dark:bg-red-400 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}; 