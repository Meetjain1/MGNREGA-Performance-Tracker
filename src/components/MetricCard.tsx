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
    <div className="metric-card group relative" title={tooltip}>
      <div className={`${colorClass} text-white rounded-full p-4 icon-large flex items-center justify-center text-4xl mb-4`}>
        {icon}
      </div>
      
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-700 mb-1">
          {titleHindi && <span className="block text-2xl mb-1">{titleHindi}</span>}
          {title}
        </h3>
        
        <div className="text-4xl font-bold text-gray-900 my-3">
          {value}
        </div>
        
        {(description || descriptionHindi) && (
          <p className="text-sm text-gray-600 mt-2">
            {descriptionHindi && <span className="block text-base mb-1">{descriptionHindi}</span>}
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
