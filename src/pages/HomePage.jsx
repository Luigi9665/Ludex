import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadLatestReviews, loadMyProfile, loadTopReviewers, loadTrendingWeeklyGames } from "../redux/action/index";
import HomePrivateArea from "../components/HomePage/HomePrivateArea";
import CommunitySidebar from "../components/HomePage/CommunitySidebar";
import TrendingSidebar from "../components/HomePage/TrendingSidebar";
import "../styles/HomePage.css";

const HomePage = () => {
  const dispatch = useDispatch();

  const authUser = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated ?? false);

  const isLogged = isAuthenticated || !!authUser?.userId;

  const myProfileState = useSelector((state) => state.userData.my) || {
    data: null,
    loading: false,
    loaded: false,
    error: null,
  };

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

  useEffect(() => {
    if (authUser?.userId && !myProfileState.loaded) {
      dispatch(loadMyProfile(authUser.userId));
    }
  }, [authUser?.userId, myProfileState.loaded, dispatch]);

  useEffect(() => {
    dispatch(loadTrendingWeeklyGames());
    dispatch(loadLatestReviews());
    dispatch(loadTopReviewers());
  }, [dispatch]);

  return (
    <div className="lx-home">
      <h1 className="lx-h1-soft">Ludex</h1>

      <div className="lx-home-inner">
        <aside className="lx-home-sidebar lx-home-sidebar--left">
          <CommunitySidebar latestReviews={latestReviews} topReviewers={topReviewers} />
        </aside>

        <main className="lx-home-main">
          <HomePrivateArea isLogged={isLogged} authUser={authUser} userDetails={myProfileState.data} userLoading={myProfileState.loading} />
        </main>

        <aside className="lx-home-sidebar lx-home-sidebar--right">
          <TrendingSidebar trending={trendingWeeklyGames} />
        </aside>
      </div>
    </div>
  );
};

export default HomePage;
