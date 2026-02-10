import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import LxLoader from "../components/LxLoader";
import { loadMyProfile, loadUserPublicProfile, loadPatchUsergame, loadDeleteUsergame } from "../redux/action";
import ProfilePanelLeft from "../components/Profile/ProfilePanelLeft";
import ProfileSidebarRight from "../components/Profile/ProfileSidebarRight";
import ProfileContentArea from "../components/Profile/ProfileContentArea";
import "../styles/ProfilePage.css";

const ProfilePage = () => {
  const { userId: routeUserId } = useParams();
  const dispatch = useDispatch();

  const authUser = useSelector((state) => state.auth.user);
  const myProfileState = useSelector((state) => state.userData.my);
  const publicProfileState = useSelector((state) => state.userData.profile);

  // stato condiviso tra centro e sidebar
  const [activeTab, setActiveTab] = useState("all");
  const [searchText, setSearchText] = useState("");

  const isMe = useMemo(() => {
    if (!routeUserId && authUser) return true;
    if (!authUser || !routeUserId) return false;
    return authUser.userId === routeUserId;
  }, [authUser, routeUserId]);

  const effectiveUserId = useMemo(() => {
    if (routeUserId) return routeUserId;
    return authUser?.userId ?? null;
  }, [authUser, routeUserId]);

  const viewState = isMe ? myProfileState : publicProfileState;
  const userDetails = viewState?.data;
  const loading = viewState?.loading;
  const error = viewState?.error;

  useEffect(() => {
    if (!effectiveUserId) return;
    if (isMe) {
      dispatch(loadMyProfile(effectiveUserId));
    } else {
      dispatch(loadUserPublicProfile(effectiveUserId));
    }
  }, [effectiveUserId, isMe, dispatch]);

  const allGames = userDetails?.games ?? [];
  const visibleGames = useMemo(() => {
    if (isMe) return allGames;
    return allGames.filter((g) => g.isReviewPublic);
  }, [allGames, isMe]);

  const stats = useMemo(() => {
    if (!visibleGames.length) {
      return { total: 0, completed: 0, playing: 0, backlog: 0, dropped: 0, avgRating: 0, reviewsCount: 0 };
    }

    const total = visibleGames.length;
    const completed = visibleGames.filter((g) => g.status === "Completed").length;
    const playing = visibleGames.filter((g) => g.status === "Playing").length;
    const backlog = visibleGames.filter((g) => g.status === "Backlog").length;
    const dropped = visibleGames.filter((g) => g.status === "Dropped").length;

    const reviewed = visibleGames.filter((g) => g.review && g.review.trim().length > 0);
    const reviewsCount = reviewed.length;

    const rated = visibleGames.filter((g) => typeof g.rating === "number" && g.rating > 0);
    const avgRating = rated.length > 0 ? Number((rated.reduce((sum, g) => sum + (g.rating ?? 0), 0) / rated.length).toFixed(1)) : 0;

    return { total, completed, playing, backlog, dropped, avgRating, reviewsCount };
  }, [visibleGames]);

  const handleUpdateUserGame = useCallback(
    (userGameId, patch) => {
      return dispatch(loadPatchUsergame(userGameId, patch, isMe));
    },
    [dispatch, isMe],
  );

  const handleDeleteUserGame = useCallback(
    (userGameId) => {
      return dispatch(
        loadDeleteUsergame(userGameId, {
          isMe,
          userId: effectiveUserId,
        }),
      );
    },
    [dispatch, isMe, effectiveUserId],
  );

  if (!effectiveUserId && !loading) {
    return (
      <section className="lx-section">
        <div className="container">
          <div className="lx-glass p-4 text-center">
            <p className="mb-0">Per vedere un profilo devi effettuare il login.</p>
          </div>
        </div>
      </section>
    );
  }

  if (loading && !userDetails) {
    return (
      <section className="lx-section">
        <div className="container">
          <LxLoader message="Carico il profilo..." />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="lx-section">
        <div className="container">
          <div className="lx-glass p-4 text-center">
            <p className="text-danger mb-2">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (!userDetails) return null;

  return (
    <section className="lx-section lx-profile-page">
      <div className="lx-profile-wrapper">
        <ProfilePanelLeft username={userDetails.userName} stats={stats} isMe={isMe} />

        <ProfileContentArea
          games={visibleGames}
          isMe={isMe}
          onUpdate={handleUpdateUserGame}
          onDelete={handleDeleteUserGame}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          searchText={searchText}
        />

        <ProfileSidebarRight games={visibleGames} activeTab={activeTab} onTabChange={setActiveTab} searchText={searchText} onSearchChange={setSearchText} />
      </div>
    </section>
  );
};

export default ProfilePage;
