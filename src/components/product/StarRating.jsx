import "./StarRating.css";

const StarRating = ({ rating, reviewCount, interactive = false, onRate, size = "sm" }) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className={`star-rating star-${size}`} aria-label={`Rating: ${rating} out of 5`}>
      <div className="stars">
        {stars.map((star) => {
          const filled = star <= Math.floor(rating);
          const half = !filled && star === Math.ceil(rating) && rating % 1 >= 0.5;
          return (
            <span
              key={star}
              className={`star ${filled ? "filled" : half ? "half" : "empty"} ${interactive ? "clickable" : ""}`}
              onClick={interactive ? () => onRate?.(star) : undefined}
            >
              {filled ? "★" : half ? "⯨" : "☆"}
            </span>
          );
        })}
      </div>
      {reviewCount !== undefined && (
        <span className="review-count">({reviewCount.toLocaleString()})</span>
      )}
    </div>
  );
};

export default StarRating;
