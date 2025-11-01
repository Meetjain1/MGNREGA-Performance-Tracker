import React from 'react';

interface MetricCardProps {
  title: string;
  titleHindi?: string;
  value: string | number;
  icon: string;
  description?: string;
  descriptionHindi?: string;
  colorClass?: string;
  tooltip?: string;
}

export default function MetricCard({
  title,
  titleHindi,
  value,
  icon,
  description,
  descriptionHindi,
  colorClass = 'bg-blue-500',
  tooltip,
}: MetricCardProps) {
  return (
    <div className="metric-card group relative w-full" title={tooltip}>
      <div className={`${colorClass} text-white rounded-full p-3 sm:p-4 w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center text-2xl sm:text-4xl mb-3 sm:mb-4 mx-auto`}>
        {icon}
      </div>
      
      <div className="text-center px-2">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-1">
          {titleHindi && <span className="block text-xl sm:text-2xl mb-1">{titleHindi}</span>}
          {title}
        </h3>
        
        <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 my-2 sm:my-3 break-words">
          {value}
        </div>
        
        {(description || descriptionHindi) && (
          <p className="text-xs sm:text-sm text-gray-600 mt-2">
            {descriptionHindi && <span className="block text-sm sm:text-base mb-1">{descriptionHindi}</span>}
            {description}
          </p>
        )}
      </div>

      {tooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
          {tooltip}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
        </div>
      )}
    </div>
  );
}
