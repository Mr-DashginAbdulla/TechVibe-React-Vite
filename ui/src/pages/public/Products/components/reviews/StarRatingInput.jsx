import { Star } from "lucide-react";

const StarRatingInput = ({ rating, hoverRating, onRate, onHover, onLeave }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRate(star)}
          onMouseEnter={() => onHover(star)}
          onMouseLeave={onLeave}
          className="p-1 transition-transform hover:scale-110"
        >
          <Star
            size={32}
            fill={star <= (hoverRating || rating) ? "currentColor" : "none"}
            className={
              star <= (hoverRating || rating) ? "text-amber-400" : "text-muted"
            }
          />
        </button>
      ))}
    </div>
  );
};

export default StarRatingInput;
