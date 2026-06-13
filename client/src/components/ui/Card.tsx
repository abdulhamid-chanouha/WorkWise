import type { HTMLAttributes, ReactNode } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  children: ReactNode;
}

export default function Card({ title, children, className = '', ...rest }: CardProps) {
  return (
    <div className={`app-card card-padding ${className}`} {...rest}>
      {title && <h2 className="card-title">{title}</h2>}
      {children}
    </div>
  );
}
