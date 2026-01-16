import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadUserDetails } from "../redux/action";
import HeroSection from "../components/HomePage/HeroSection";

const HomePage = () => {
  const authUser = useSelector((state) => state.auth.user);
  const { userDetails, loading } = useSelector((state) => state.userData);

  const dispatch = useDispatch();

  useEffect(() => {
    if (authUser?.userId) {
      dispatch(loadUserDetails(authUser.userId));
    }
  }, [authUser?.userId, dispatch]);

  if (loading || !userDetails) {
    return <span>Loading ...</span>;
  }

  const games = userDetails.games || [];
  const reviews = games.filter((g) => (g.review ?? "").trim().length > 0);

  const stats = {
    gamesCount: games.length,
    reviewsCount: reviews.length,
    friendCount: 0,
  };

  return (
    <div className="">
      <h1>Ludex</h1>
      <HeroSection user={authUser} stats={stats} />
      <p>Area privata</p>
    </div>
  );
};

export default HomePage;
