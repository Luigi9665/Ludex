import LxLoader from "../LxLoader";
import HeroSection from "./HeroSection";
import GameShelves from "./GameShelves";

const HomePrivateArea = ({ isLogged, authUser, userDetails, userLoading }) => {
  if (!isLogged) {
    return <HeroSection user={null} stats={null} userGames={[]} />;
  }

  if (userLoading || !userDetails) {
    return (
      <div className="lx-home-loading">
        <LxLoader message="Sto preparando la tua libreria personale..." />
      </div>
    );
  }

  const games = userDetails.games || [];
  const reviews = games.filter((g) => (g.review ?? "").trim().length > 0);

  const stats = {
    gamesCount: games.length,
    reviewsCount: reviews.length,
    friendsCount: 0,
  };

  return (
    <>
      <HeroSection user={authUser} stats={stats} userGames={games} />
      <GameShelves userGames={games} />
    </>
  );
};

export default HomePrivateArea;
