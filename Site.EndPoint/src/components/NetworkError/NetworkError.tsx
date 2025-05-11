import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../Button/Button';

interface NetworkErrorProps {
  onRetry: () => void;
  className?: string;
}

export const NetworkError: React.FC<NetworkErrorProps> = ({ onRetry, className = '' }) => {
  const { t } = useTranslation();

  return (
    <div className={`flex flex-col items-center justify-center min-h-[400px] p-4 ${className}`}>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {t('error.network.title')}
        </h2>
        <p className="text-gray-600 mb-8">
          {t('error.network.message')}
        </p>
        <Button
          variant="primary"
          size="lg"
          onClick={onRetry}
        >
          {t('error.network.retry')}
        </Button>
      </div>
    </div>
  );
}; 