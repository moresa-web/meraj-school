import React, { useEffect, useState } from 'react';
import { AppError } from '../../utils/errorHandler';
import ErrorDisplay from '../ErrorDisplay/ErrorDisplay';

interface GlobalErrorProps {
  error: AppError | null;
  onDismiss?: () => void;
}

const GlobalError: React.FC<GlobalErrorProps> = ({ error, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (error) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onDismiss) {
          onDismiss();
        }
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error, onDismiss]);

  if (!error || !isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 w-full max-w-md transform transition-all duration-300 ease-in-out">
      <ErrorDisplay
        error={error}
        onDismiss={() => {
          setIsVisible(false);
          if (onDismiss) {
            onDismiss();
          }
        }}
        className="shadow-lg"
      />
    </div>
  );
};

export default GlobalError; 