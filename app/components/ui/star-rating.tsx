"use client";
import { Star } from "lucide-react";

type StarRatingProps = {
  rating: number;
  maxRating?: number;
  size?: number;
  showValue?: boolean;
};

export default function StarRating({
  rating,
  maxRating = 5,
  size = 16,
  showValue = false,
}: StarRatingProps) {
  const stars = Array.from({ length: maxRating }, (_, index) => {
    const starValue = index + 1;
    const isFilled = starValue <= rating;
    const isHalf = starValue - 0.5 <= rating && rating < starValue;

    return (
      <Star
        key={index}
        size={size}
        className={`${
          isFilled
            ? "fill-yellow-400 text-yellow-400"
            : isHalf
            ? "fill-yellow-200 text-yellow-400"
            : "text-gray-300"
        }`}
      />
    );
  });

  return (
    <div className="flex items-center gap-1">
      {stars}
      {showValue && (
        <span className="text-sm text-base-content/70 ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}