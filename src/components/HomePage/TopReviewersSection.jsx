import { Link } from "react-router";
import LxLoader from "../LxLoader";

const TopReviewersSection = ({ loading, error, users }) => {
  const items = users ?? [];

  if (loading) {
    return (
      <section className="lx-section">
        <div className="container">
          <LxLoader message="Carico i top player..." />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="lx-section">
        <div className="container">
          <div className="lx-glass p-4 text-center">
            <p className="text-muted mb-0">Leaderboard offline… riprova tra poco.</p>
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) return null;

  return (
    <section className="lx-section">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="lx-section-title">🏆 Top Reviewer</h2>
          <span className="lx-link">Chi sta grindando di più</span>
        </div>

        <div className="row g-3">
          {items.map((u, idx) => (
            <div key={u.userid ?? `${u.username}-${idx}`} className="col-12 col-md-6 col-lg-4">
              <div className="lx-glow-card lx-topper-card p-3">
                <div className="d-flex align-items-center gap-3">
                  <div className={`lx-rank-badge ${idx < 3 ? "lx-rank-badge--top" : ""}`}>#{idx + 1}</div>

                  <div className="flex-grow-1">
                    <div className="lx-topper-name">@{u.username}</div>
                    <div className="lx-topper-sub text-muted small">Recensioni pubbliche</div>
                  </div>

                  <div className="lx-topper-count">
                    <span>{u.reviewsCount}</span>
                  </div>
                </div>

                {/* opzionale: navigazione profilo */}
                {/* <Link to={`/profile/${u.userid}`} className="btn lx-btn-outline w-100 mt-3">Apri profilo</Link> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopReviewersSection;
