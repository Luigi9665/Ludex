import { useNavigate } from "react-router";
import LxLoader from "../LxLoader";

const CommunitySidebar = ({ latestReviews, topReviewers }) => {
  const navigate = useNavigate();

  const reviewsLoading = latestReviews?.loading ?? false;
  const reviewsError = latestReviews?.error ?? null;
  const reviewsItems = (latestReviews?.items ?? []).slice(0, 4);

  const reviewersLoading = topReviewers?.loading ?? false;
  const reviewersError = topReviewers?.error ?? null;
  const reviewersItems = (topReviewers?.items ?? []).slice(0, 5);

  const handleUserClick = (userId) => {
    if (!userId) return;
    navigate(`/profile/${userId}`);
  };

  return (
    <aside className="lx-community-frame">
      <div className="lx-community">
        <section className="lx-community-section">
          <header className="lx-community-header">
            <i className="bi bi-star-fill" />
            <h3 className="lx-community-title">Ultime Recensioni</h3>
          </header>

          {reviewsLoading && (
            <div className="lx-community-loading">
              <LxLoader message="Caricamento..." />
            </div>
          )}

          {!reviewsLoading && reviewsError && <div className="lx-community-error">Errore nel caricamento</div>}

          {!reviewsLoading && !reviewsError && reviewsItems.length > 0 && (
            <div className="lx-community-list">
              {reviewsItems.map((review) => (
                <article key={review.userGameId} className="lx-review-compact">
                  <header className="lx-review-compact-header">
                    <img src={review.coverUrl} alt={review.title} className="lx-review-compact-cover" />
                    <div className="lx-review-compact-info">
                      <div className="lx-review-compact-game">{review.title}</div>
                      <button type="button" className="lx-review-compact-user" onClick={() => handleUserClick(review.userId)}>
                        @{review.username}
                      </button>
                    </div>
                  </header>
                  <p className="lx-review-compact-text">{review.review}</p>
                </article>
              ))}
            </div>
          )}
        </section>

        <hr className="lx-community-divider" />

        <section className="lx-community-section">
          <header className="lx-community-header">
            <i className="bi bi-trophy-fill" />
            <h3 className="lx-community-title">Top Reviewers</h3>
          </header>

          {reviewersLoading && (
            <div className="lx-community-loading">
              <LxLoader message="Caricamento..." />
            </div>
          )}

          {!reviewersLoading && reviewersError && <div className="lx-community-error">Errore nel caricamento</div>}

          {!reviewersLoading && !reviewersError && reviewersItems.length > 0 && (
            <div className="lx-community-list">
              {reviewersItems.map((user, idx) => (
                <button key={user.userid ?? idx} type="button" className="lx-reviewer-compact" onClick={() => handleUserClick(user.userid)}>
                  <div className="lx-reviewer-compact-rank">#{idx + 1}</div>
                  <div className="lx-reviewer-compact-info">
                    <div className="lx-reviewer-compact-name">@{user.username}</div>
                    <div className="lx-reviewer-compact-count">{user.reviewsCount} recensioni</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>
      </div>
    </aside>
  );
};

export default CommunitySidebar;
