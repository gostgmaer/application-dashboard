// components/ui/StarRating.tsx
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
  className?: string;
}

export function StarRating({ rating, size = 'md', showNumber = false, className = '' }: StarRatingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const roundedRating = Math.round(rating * 2) / 2; // Round to nearest 0.5

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= Math.floor(roundedRating);
        const halfFilled = star === Math.ceil(roundedRating) && roundedRating % 1 !== 0;

        return (
          <div key={star} className="relative">
            <Star
              className={`${sizeClasses[size]} text-gray-300`}
            />
            {(filled || halfFilled) && (
              <Star
                className={`absolute top-0 left-0 ${sizeClasses[size]} text-yellow-400 fill-current ${
                  halfFilled ? 'w-1/2 overflow-hidden' : ''
                }`}
              />
            )}
          </div>
        );
      })}
      
      {showNumber && (
        <span className="text-sm text-gray-600 ml-1">
          ({rating.toFixed(1)})
        </span>
      )}
    </div>
  );
}