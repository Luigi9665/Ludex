import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadLatestReviews, loadTopReviewers, loadTrendingWeeklyGames, loadUserDetails } from "../redux/action";
import HomePrivateArea from "../components/HomePage/HomePrivateArea";
import HomePublicArea from "../components/HomePage/HomePublicArea";

const HomePage = () => {
  const dispatch = useDispatch();

  const authUser = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated ?? false);

  // fallback nel caso non ci sia isAuthenticated
  const isLogged = isAuthenticated || !!authUser?.userId;

  // dati privati utente
  const { userDetails, loading, loaded } = useSelector((state) => state.userData);

  // dati pubblici home
  const homePublic = useSelector((state) => state.homePublic) || {};

  const trendingWeeklyGames = homePublic.trendingWeeklyGames || {
    items: [],
    loading: false,
    error: null,
  };

  const latestReviews = homePublic.latestReviews || {
    items: [],
    loading: false,
    error: null,
  };

  const topReviewers = homePublic.topReviewers || {
    items: [],
    loading: false,
    error: null,
  };

  // load dati utente solo se loggato
  useEffect(() => {
    if (authUser?.userId && !loaded) {
      dispatch(loadUserDetails(authUser.userId));
    }
  }, [authUser?.userId, loaded, dispatch]);

  // load sezioni pubbliche
  useEffect(() => {
    dispatch(loadTrendingWeeklyGames());
    dispatch(loadLatestReviews());
    dispatch(loadTopReviewers());
  }, [dispatch]);

  return (
    <div className="container-fluid pt-3">
      {/* H1 SEO soft */}
      <h1 className="lx-h1-soft text-end">Ludex</h1>

      {/* AREA PRIVATA */}
      <HomePrivateArea isLogged={isLogged} authUser={authUser} userDetails={userDetails} userLoading={loading} />

      {/* AREA PUBBLICA */}
      <HomePublicArea trending={trendingWeeklyGames} latest={latestReviews} topReviewers={topReviewers} />
    </div>
  );
};

export default HomePage;
