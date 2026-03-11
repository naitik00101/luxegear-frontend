import "./Skeleton.css";

export const Skeleton = ({ width, height, borderRadius, className = "" }) => (
  <div 
    className={`skeleton ${className}`} 
    style={{ 
      width: width || "100%", 
      height: height || "20px",
      borderRadius: borderRadius || "var(--border-radius-sm)"
    }} 
  />
);

export const ProductCardSkeleton = () => (
  <div className="product-card skeleton-card">
    <Skeleton height="300px" borderRadius="0" />
    <div className="product-card__content" style={{ padding: "var(--space-md)" }}>
      <Skeleton width="40%" height="12px" style={{ marginBottom: "8px" }} />
      <Skeleton width="80%" height="20px" style={{ marginBottom: "12px" }} />
      <Skeleton width="50%" height="16px" />
    </div>
  </div>
);

export const DetailSkeleton = () => (
  <div className="detail-grid">
    <div className="detail-gallery">
      <Skeleton height="500px" borderRadius="var(--border-radius-lg)" />
      <div className="gallery-thumbs" style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
        {[1, 2, 3, 4].map(i => <Skeleton key={i} width="80px" height="80px" />)}
      </div>
    </div>
    <div className="detail-info">
      <Skeleton width="100px" height="14px" style={{ marginBottom: "10px" }} />
      <Skeleton width="70%" height="40px" style={{ marginBottom: "20px" }} />
      <Skeleton width="150px" height="20px" style={{ marginBottom: "30px" }} />
      <Skeleton width="100%" height="100px" style={{ marginBottom: "30px" }} />
      <div style={{ display: "flex", gap: "20px" }}>
        <Skeleton width="120px" height="50px" />
        <Skeleton width="200px" height="50px" />
      </div>
    </div>
  </div>
);
