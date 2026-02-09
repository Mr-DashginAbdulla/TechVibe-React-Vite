import "react-loading-skeleton/dist/skeleton.css";

const Skeleton = ({
  width = "100%",
  height = "20px",
  borderRadius = "8px",
  className = "",
  count = 1,
  circle = false,
}) => {
  const baseStyle = {
    width: circle ? height : width,
    height,
    borderRadius: circle ? "50%" : borderRadius,
  };

  const skeletons = Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      className={`skeleton-shimmer ${className}`}
      style={baseStyle}
    />
  ));

  return count === 1 ? (
    skeletons[0]
  ) : (
    <div className="skeleton-group">{skeletons}</div>
  );
};

export default Skeleton;
