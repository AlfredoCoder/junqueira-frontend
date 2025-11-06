"use client";

import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ResponsiveButtonProps extends ButtonProps {
  mobileText?: string;
  desktopText?: string;
  iconOnly?: boolean;
  fullWidthOnMobile?: boolean;
}

interface ResponsiveButtonGroupProps {
  children: React.ReactNode;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

export const ResponsiveButton: React.FC<ResponsiveButtonProps> = ({ 
  children,
  mobileText,
  desktopText,
  iconOnly = false,
  fullWidthOnMobile = false,
  className,
  ...props
}) => {
  const buttonClasses = cn(
    fullWidthOnMobile && "w-full sm:w-auto",
    iconOnly && "px-2 sm:px-3",
    className
  );

  return (
    <Button className={buttonClasses} {...props}>
      {mobileText && desktopText ? (
        <>
          <span className="sm:hidden">{mobileText}</span>
          <span className="hidden sm:inline">{desktopText}</span>
        </>
      ) : (
        children
      )}
    </Button>
  );
};

export const ResponsiveButtonGroup: React.FC<ResponsiveButtonGroupProps> = ({ 
  children, 
  className,
  orientation = 'horizontal'
}) => {
  const groupClasses = cn(
    "flex gap-2 sm:gap-3",
    orientation === 'vertical' ? "flex-col sm:flex-row" : "flex-col sm:flex-row",
    className
  );

  return (
    <div className={groupClasses}>
      {children}
    </div>
  );
};

export const ResponsiveIconButton: React.FC<ButtonProps & { 
  icon: React.ReactNode;
  label?: string;
  showLabelOnDesktop?: boolean;
}> = ({ 
  icon, 
  label, 
  showLabelOnDesktop = true,
  className,
  ...props 
}) => {
  return (
    <Button 
      className={cn(
        "flex items-center gap-1 sm:gap-2",
        !showLabelOnDesktop && "px-2 sm:px-3",
        className
      )}
      {...props}
    >
      <span className="flex-shrink-0">{icon}</span>
      {label && showLabelOnDesktop && (
        <span className="hidden sm:inline text-sm">{label}</span>
      )}
    </Button>
  );
};
