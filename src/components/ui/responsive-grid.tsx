"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
  };
}

interface ResponsiveFormGridProps {
  children: React.ReactNode;
  className?: string;
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({ 
  children, 
  className,
  cols = { default: 1, sm: 2, lg: 4 },
  gap = { default: 4, sm: 6 }
}) => {
  const gridClasses = cn(
    "grid",
    // Colunas
    cols.default && `grid-cols-${cols.default}`,
    cols.sm && `sm:grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`,
    // Gaps
    gap.default && `gap-${gap.default}`,
    gap.sm && `sm:gap-${gap.sm}`,
    gap.md && `md:gap-${gap.md}`,
    gap.lg && `lg:gap-${gap.lg}`,
    className
  );

  return (
    <div className={gridClasses}>
      {children}
    </div>
  );
};

export const ResponsiveFormGrid: React.FC<ResponsiveFormGridProps> = ({ 
  children, 
  className 
}) => {
  return (
    <div className={cn(
      "grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6",
      className
    )}>
      {children}
    </div>
  );
};

export const ResponsiveStatsGrid: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => {
  return (
    <div className={cn(
      "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6",
      className
    )}>
      {children}
    </div>
  );
};

export const ResponsiveChartsGrid: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => {
  return (
    <div className={cn(
      "grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8",
      className
    )}>
      {children}
    </div>
  );
};
