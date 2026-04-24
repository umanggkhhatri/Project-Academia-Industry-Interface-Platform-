

interface SkeletonProps {
  className?: string;
  variant?: 'rectangular' | 'circular' | 'text';
}

export default function Skeleton({ className = '', variant = 'rectangular' }: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-gray-200 dark:bg-gray-700';
  
  let variantClasses = '';
  switch (variant) {
    case 'circular':
      variantClasses = 'rounded-full';
      break;
    case 'text':
      variantClasses = 'rounded-sm h-4 w-full';
      break;
    case 'rectangular':
    default:
      variantClasses = 'rounded-md';
      break;
  }

  return <div className={`${baseClasses} ${variantClasses} ${className}`} />;
}
