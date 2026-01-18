const StarRating = ({ rating, size = "sm" }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 !== 0;

  for (let i = 0; i < fullStars; i++) {
    stars.push(<i key={i} className="bi bi-star-fill lx-star"></i>);
  }
  if (hasHalf) {
    stars.push(<i key="half" className="bi bi-star-half lx-star"></i>);
  }
  while (stars.length < 5) {
    stars.push(<i key={`empty-${stars.length}`} className="bi bi-star lx-star-empty"></i>);
  }

  return <span className={`lx-rating lx-rating-${size}`}>{stars}</span>;
};

export default StarRating;
