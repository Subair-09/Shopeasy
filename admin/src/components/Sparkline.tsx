import React from 'react';

interface SparklineProps {
  color: 'purple' | 'blue' | 'green' | 'yellow' | 'orange';
  className?: string;
}

export const Sparkline: React.FC<SparklineProps> = ({ color, className = 'w-24 h-9' }) => {
  const colorMap = {
    purple: { stroke: '#5135ED', fill: '#5135ED' },
    blue: { stroke: '#3B82F6', fill: '#3B82F6' },
    green: { stroke: '#10B981', fill: '#10B981' },
    yellow: { stroke: '#F59E0B', fill: '#F59E0B' },
    orange: { stroke: '#F97316', fill: '#F97316' },
  };

  const c = colorMap[color] || colorMap.purple;
  const gradId = `sparkline-grad-${color}-${Math.random().toString(36).substring(2, 7)}`;

  return (
    <svg className={className} viewBox="0 0 100 35" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="35" gradientUnits="userSpaceOnUse">
          <stop stopColor={c.fill} stopOpacity="0.25" />
          <stop offset="1" stopColor={c.fill} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <path
        d="M2 28 C 18 10, 32 30, 48 18 C 64 6, 80 22, 98 12 L 98 35 L 2 35 Z"
        fill={`url(#${gradId})`}
      />
      <path
        d="M2 28 C 18 10, 32 30, 48 18 C 64 6, 80 22, 98 12"
        stroke={c.stroke}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
};
