import LxLoader from "../LxLoader";
import LatestReviewsSection from "./LatestReviewsSection";
import TopReviewersSection from "./TopReviewersSection";
import TrendingGames from "./TrendingGames";

const HomePublicArea = ({ trending, latest, topReviewers }) => {
  const trendingLoading = trending?.loading ?? false;
  const trendingError = trending?.error ?? null;
  const trendingItems = trending?.items ?? [];

  return (
    <>
      {/* TRENDING GAMES SETTIMANALI */}
      {trendingLoading && (
        <section className="lx-section">
          <div className="container">
            <LxLoader message="Scopro i giochi in tendenza..." />
          </div>
        </section>
      )}

      {!trendingLoading && !trendingError && <TrendingGames games={trendingItems} />}

      {!trendingLoading && trendingError && (
        <section className="lx-section">
          <div className="container">
            <div className="lx-glass p-4 text-center">
              <p className="text-muted mb-0">Non riesco a caricare i giochi in tendenza al momento.</p>
            </div>
          </div>
        </section>
      )}

      {/* ULTIME RECENSIONI - quando avrai il componente LatestReviewsSection */}

      <LatestReviewsSection loading={latest.loading} error={latest.error} reviews={latest.items || []} />

      {/* TOP REVIEWERS - quando avrai il componente TopReviewersSection */}

      <TopReviewersSection loading={topReviewers.loading} error={topReviewers.error} users={topReviewers.items || []} />
    </>
  );
};
export default HomePublicArea;
