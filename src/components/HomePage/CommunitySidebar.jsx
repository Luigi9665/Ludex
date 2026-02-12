import { useNavigate, Link } from "react-router";
import LxLoader from "../LxLoader";
import React, { useCallback, useMemo } from "react";

const CommunitySidebar = ({ latestReviews, topReviewers }) => {
  const navigate = useNavigate();

  const reviewsLoading = latestReviews?.loading ?? false;
  const reviewsError = latestReviews?.error ?? null;

  const reviewersLoading = topReviewers?.loading ?? false;
  const reviewersError = topReviewers?.error ?? null;

  const reviewsItems = useMemo(() => (latestReviews?.items ?? []).slice(0, 4), [latestReviews?.items]);
  const reviewersItems = useMemo(() => (topReviewers?.items ?? []).slice(0, 5), [topReviewers?.items]);

  const handleUserClick = useCallback(
    (userId) => {
      if (!userId) return;
      navigate(`/profile/${userId}`);
    },
    [navigate],
  );

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
                <Link key={review.userGameId} to={`/game/${review.gameId}`} className="lx-review-compact-link">
                  <article className="lx-review-compact">
                    <header className="lx-review-compact-header">
                      <img src={review.coverUrl} alt={review.title} className="lx-review-compact-cover" />
                      <div className="lx-review-compact-info">
                        <div className="lx-review-compact-game">{review.title}</div>
                        <button
                          type="button"
                          className="lx-review-compact-user"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleUserClick(review.userId);
                          }}
                        >
                          @{review.username}
                        </button>
                      </div>
                    </header>
                    <p className="lx-review-compact-text">{review.review}</p>
                  </article>
                </Link>
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

export default React.memo(CommunitySidebar);
