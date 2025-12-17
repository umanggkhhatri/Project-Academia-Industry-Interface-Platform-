import type { ReactNode, HTMLAttributes } from 'react';
import { clsx } from 'clsx';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
}

const Card = ({ children, className, padding = 'md', hover = false, ...rest }: CardProps) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div 
      {...rest}
      className={clsx(
        'bg-white rounded-lg shadow-[0_2px_6px_rgba(0,0,0,0.08)]',
        paddingClasses[padding],
        hover && 'hover:shadow-[0_6px_14px_rgba(0,0,0,0.12)] transition-shadow duration-200',
        rest.onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;