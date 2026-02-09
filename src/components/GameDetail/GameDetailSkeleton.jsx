const GameDetailSkeleton = () => {
  return (
    <div className="lx-game-detail-page">
      {/* Hero Skeleton */}
      <section className="lx-hero--game-detail">
        <div className="lx-hero-bg-blur" style={{ background: "rgba(20, 30, 50, 0.3)" }} />
        <div className="lx-hero-overlay" />

        <div className="lx-hero-content">
          <div className="lx-hero-cover">
            <div className="lx-skeleton" style={{ width: "100%", height: "100%" }} />
          </div>

          <div className="lx-hero-info">
            <div className="lx-skeleton lx-skeleton--title" />
            <div className="lx-skeleton lx-skeleton--text" style={{ width: "40%" }} />
            <div className="lx-skeleton lx-skeleton--text" style={{ width: "60%", marginTop: "24px" }} />
            <div className="lx-skeleton lx-skeleton--text" style={{ width: "80%" }} />
            <div className="lx-skeleton lx-skeleton--text" style={{ width: "70%" }} />
          </div>
        </div>
      </section>

      {/* Content Skeletons */}
      <div className="lx-game-detail-content">
        <div className="lx-skeleton lx-skeleton--card" style={{ marginTop: "40px" }} />
        <div className="lx-skeleton lx-skeleton--card" style={{ marginTop: "40px" }} />
        <div className="lx-skeleton lx-skeleton--card" style={{ marginTop: "40px" }} />
      </div>
    </div>
  );
};

export default GameDetailSkeleton;
