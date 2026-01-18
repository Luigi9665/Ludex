import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadUserDetails } from "../redux/action";
import HeroSection from "../components/HomePage/HeroSection";
import LxLoader from "../components/LxLoader";

const HomePage = () => {
  const authUser = useSelector((state) => state.auth.user);
  const { userDetails, loading } = useSelector((state) => state.userData);

  const dispatch = useDispatch();

  useEffect(() => {
    if (authUser?.userId) {
      dispatch(loadUserDetails(authUser.userId));
    }
  }, [authUser?.userId, dispatch]);

  // preparo dati stats SOLO se ho userDetails
  const games = userDetails?.games || [];
  const reviews = games.filter((g) => (g.review ?? "").trim().length > 0);

  const stats = {
    gamesCount: games.length,
    reviewsCount: reviews.length,
    friendsCount: 0,
  };

  const isLogged = !!authUser;
  const isStatsReady = isLogged && !loading && userDetails;

  return (
    <div className="container-fluid pt-3">
      <h1 className="lx-h1-soft text-end">Ludex</h1>

      {/* HERO SECTION */}
      {isLogged ? (
        // utente loggato → o loader oppure hero con stats
        isStatsReady ? (
          <HeroSection user={authUser} stats={stats} />
        ) : (
          <LxLoader message="Carico la tua libreria..." />
        )
      ) : (
        // utente non loggato → hero in modalità guest
        <HeroSection user={null} stats={null} />
      )}

      <p>Area privata</p>
    </div>
  );
};

export default HomePage;
