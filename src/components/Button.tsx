import React, { CSSProperties } from 'react';
import type { ReactNode } from 'react';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  children,
  onMouseEnter,
  onMouseLeave,
  ...props
}: ButtonProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  const getVariantStyles = (): CSSProperties => {
    const baseStyles: CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 600,
      borderRadius: '12px',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      border: 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1,
      outline: 'none',
      position: 'relative',
      overflow: 'hidden',
      letterSpacing: '0.5px',
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyles,
          background: isHovered
            ? 'linear-gradient(135deg, #0369a1 0%, #0284c7 50%, #0369a1 100%)'
            : 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
          color: '#ffffff',
          boxShadow: isHovered
            ? '0 30px 60px rgba(2, 132, 199, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
            : '0 15px 35px rgba(2, 132, 199, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
          transform: isHovered ? 'translateY(-3px) scale(1.02)' : 'translateY(0) scale(1)',
        };

      case 'secondary':
        return {
          ...baseStyles,
          background: isHovered
            ? 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)'
            : 'linear-gradient(135deg, #6d28d9 0%, #7c3aed 100%)',
          color: '#ffffff',
          boxShadow: isHovered
            ? '0 30px 60px rgba(109, 40, 217, 0.4)'
            : '0 15px 35px rgba(109, 40, 217, 0.2)',
          transform: isHovered ? 'translateY(-3px) scale(1.02)' : 'translateY(0) scale(1)',
        };

      case 'danger':
        return {
          ...baseStyles,
          background: isHovered
            ? 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
            : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          color: '#ffffff',
          boxShadow: isHovered
            ? '0 30px 60px rgba(239, 68, 68, 0.5)'
            : '0 15px 35px rgba(239, 68, 68, 0.3)',
          transform: isHovered ? 'translateY(-3px) scale(1.02)' : 'translateY(0) scale(1)',
        };

      case 'outline':
        return {
          ...baseStyles,
          background: isHovered
            ? 'rgba(2, 132, 199, 0.15)'
            : 'rgba(255, 255, 255, 0.5)',
          color: '#0284c7',
          border: '2px solid #0284c7',
          boxShadow: isHovered
            ? '0 20px 40px rgba(2, 132, 199, 0.2)'
            : '0 10px 25px rgba(2, 132, 199, 0.1)',
          transform: isHovered ? 'translateY(-3px)' : 'translateY(0)',
        };

      case 'ghost':
        return {
          ...baseStyles,
          background: isHovered ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
          color: '#374151',
          boxShadow: 'none',
          transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        };

      default:
        return baseStyles;
    }
  };

  const getSizeStyles = (): CSSProperties => {
    switch (size) {
      case 'sm':
        return { padding: '8px 14px', fontSize: '0.875rem' };
      case 'lg':
        return { padding: '16px 28px', fontSize: '1.125rem', fontWeight: 700 };
      case 'md':
      default:
        return { padding: '12px 20px', fontSize: '1rem' };
    }
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsHovered(true);
    onMouseEnter?.(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsHovered(false);
    onMouseLeave?.(e);
  };

  const combinedStyles: CSSProperties = {
    ...getVariantStyles(),
    ...getSizeStyles(),
  };

  return (
    <button
      style={combinedStyles}
      disabled={disabled || isLoading}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {isLoading && (
        <svg
          style={{
            animation: 'spin 1s linear infinite',
            marginRight: '8px',
            width: '16px',
            height: '16px',
          }}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <style>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            style={{ opacity: 0.25 }}
          />
          <path
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            style={{ opacity: 0.75 }}
          />
        </svg>
      )}
      {children}
    </button>
  );
}
