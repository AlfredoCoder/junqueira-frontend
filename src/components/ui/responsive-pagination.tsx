"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ResponsivePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  className?: string;
  showInfo?: boolean;
  itemName?: string;
}

export const ResponsivePagination: React.FC<ResponsivePaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  className,
  showInfo = true,
  itemName = "itens"
}) => {
  if (totalPages <= 1) return null;

  const startItem = ((currentPage - 1) * itemsPerPage) + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className={cn(
      "flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 mt-6",
      className
    )}>
      {showInfo && (
        <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
          Mostrando {startItem} a {endItem} de {totalItems} {itemName}
        </p>
      )}
      
      <div className="flex gap-2 items-center">
        <Button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          variant="outline"
          size="sm"
          className="text-xs sm:text-sm px-2 sm:px-3"
        >
          <span className="hidden sm:inline">Anterior</span>
          <span className="sm:hidden">Ant</span>
        </Button>
        
        <span className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-blue-100 text-blue-800 rounded">
          {currentPage} de {totalPages}
        </span>
        
        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          variant="outline"
          size="sm"
          className="text-xs sm:text-sm px-2 sm:px-3"
        >
          <span className="hidden sm:inline">Próximo</span>
          <span className="sm:hidden">Prox</span>
        </Button>
      </div>
    </div>
  );
};

interface ResponsivePageInfoProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  itemName?: string;
  className?: string;
}

export const ResponsivePageInfo: React.FC<ResponsivePageInfoProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  itemName = "itens",
  className
}) => {
  const startItem = ((currentPage - 1) * itemsPerPage) + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <p className={cn(
      "text-xs sm:text-sm text-gray-600 text-center sm:text-left",
      className
    )}>
      Mostrando {startItem} a {endItem} de {totalItems} {itemName}
    </p>
  );
};
