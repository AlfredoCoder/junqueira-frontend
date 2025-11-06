"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveTableProps {
  children: React.ReactNode;
  className?: string;
  minWidth?: string;
}

interface ResponsiveTableHeaderProps {
  children: React.ReactNode;
  className?: string;
  hideOnMobile?: boolean;
  hideOnTablet?: boolean;
}

interface ResponsiveTableCellProps {
  children: React.ReactNode;
  className?: string;
  hideOnMobile?: boolean;
  hideOnTablet?: boolean;
  mobileLabel?: string;
  mobileContent?: React.ReactNode;
}

export const ResponsiveTable: React.FC<ResponsiveTableProps> = ({ 
  children, 
  className,
  minWidth = "800px"
}) => {
  return (
    <div className="overflow-x-auto">
      <table className={cn("w-full", className)} style={{ minWidth }}>
        {children}
      </table>
    </div>
  );
};

export const ResponsiveTableHeader: React.FC<ResponsiveTableHeaderProps> = ({ 
  children, 
  className,
  hideOnMobile = false,
  hideOnTablet = false
}) => {
  const hiddenClasses = cn(
    hideOnMobile && "hidden sm:table-cell",
    hideOnTablet && "hidden md:table-cell"
  );

  return (
    <th className={cn(
      "text-left py-3 px-2 sm:px-4 font-medium text-gray-900 text-sm",
      hiddenClasses,
      className
    )}>
      {children}
    </th>
  );
};

export const ResponsiveTableCell: React.FC<ResponsiveTableCellProps> = ({ 
  children, 
  className,
  hideOnMobile = false,
  hideOnTablet = false,
  mobileLabel,
  mobileContent
}) => {
  const hiddenClasses = cn(
    hideOnMobile && "hidden sm:table-cell",
    hideOnTablet && "hidden md:table-cell"
  );

  return (
    <td className={cn(
      "py-3 px-2 sm:px-4",
      hiddenClasses,
      className
    )}>
      {/* Conteúdo mobile alternativo */}
      {mobileContent && hideOnMobile && (
        <div className="sm:hidden">
          {mobileLabel && (
            <span className="text-xs text-gray-500 block">{mobileLabel}</span>
          )}
          {mobileContent}
        </div>
      )}
      
      {/* Conteúdo padrão */}
      <div className={hideOnMobile ? "hidden sm:block" : ""}>
        {children}
      </div>
    </td>
  );
};

export const ResponsiveTableRow: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => {
  return (
    <tr className={cn("border-b hover:bg-gray-50", className)}>
      {children}
    </tr>
  );
};
