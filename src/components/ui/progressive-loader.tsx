import React from 'react';
import { Loader2 } from 'lucide-react';

interface ProgressiveLoaderProps {
  stage: number;
  totalStages: number;
  currentAction?: string;
  className?: string;
}

export function ProgressiveLoader({ 
  stage, 
  totalStages, 
  currentAction = 'Carregando...', 
  className = '' 
}: ProgressiveLoaderProps) {
  const progress = Math.round((stage / totalStages) * 100);

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 p-8 ${className}`}>
      {/* Spinner */}
      <div className="relative">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-medium text-blue-600">
            {stage}/{totalStages}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-xs">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>{currentAction}</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Stage Indicators */}
      <div className="flex space-x-2">
        {Array.from({ length: totalStages }, (_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-colors duration-200 ${
              i < stage 
                ? 'bg-green-500' 
                : i === stage 
                ? 'bg-blue-500 animate-pulse' 
                : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// Componente mais simples para transições rápidas
export function SimpleLoader({ message = 'Carregando...', className = '' }: { 
  message?: string; 
  className?: string; 
}) {
  return (
    <div className={`flex items-center justify-center space-x-2 p-4 ${className}`}>
      <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
      <span className="text-sm text-gray-600">{message}</span>
    </div>
  );
}
