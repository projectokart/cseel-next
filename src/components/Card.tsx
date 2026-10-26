import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div
      className={`portal-card ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function CardHeader({
  title,
  subtitle,
  badge,
  actions,
  className = ''
}: CardHeaderProps) {
  return (
    <div className={`portal-card-header ${className}`}>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="portal-card-title truncate">{title}</h3>
          {badge}
        </div>
        {subtitle && <p className="portal-card-subtitle truncate">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-1.5 shrink-0">{actions}</div>}
    </div>
  );
}

export function CardContent({ children, className = '', ...props }: CardProps) {
  return (
    <div className={`portal-card-content ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '', ...props }: CardProps) {
  return (
    <div
      className={`portal-card-footer ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
