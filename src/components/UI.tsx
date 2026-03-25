import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', fullWidth, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none';
    
    const variants = {
      primary: 'font-medium transition-opacity hover:opacity-90',
      secondary: 'bg-bg-surface-elevated hover:bg-border-subtle',
      outline: 'bg-transparent border border-border-subtle hover:border-white transition-colors',
      ghost: 'bg-transparent hover:text-white transition-colors',
    };

    const variantStyles: any = {
      primary: { backgroundColor: '#ffffff', color: '#000000', borderColor: '#ffffff', borderStyle: 'solid', borderWidth: '1px' },
      secondary: { color: '#ffffff' },
      outline: { color: '#ffffff' },
      ghost: { color: '#a1a1aa' }
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], fullWidth && 'w-full', className)}
        style={{ ...variantStyles[variant], ...(props.style || {}) }}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, glass = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('bg-bg-surface-elevated rounded-md border border-border-subtle', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';

export const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("px-6 py-4 border-b border-border-subtle", className)} {...props} />
);

export const CardTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={cn("text-base font-medium text-white", className)} {...props} />
);

export const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("p-6", className)} {...props} />
);

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            "flex h-10 w-full rounded-md border border-border-subtle bg-bg-base px-3 text-sm text-white placeholder:text-text-muted focus:border-white focus:outline-none transition-colors disabled:opacity-50",
            icon && "pl-9",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = 'Input';
