import { useCallback, useEffect, useMemo } from "react";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import LxLoader from "../components/LxLoader";
import { loadUserDetails } from "../redux/action";
import ProfileHeader from "../components/Profile/ProfileHeader";
import ProfileGameSection from "../components/Profile/ProfileGameSection";
import "../styles/ProfilePage.css";

const ProfilePage = () => {
  const { userId: routeUserId } = useParams();
  const dispatch = useDispatch();

  const authUser = useSelector((state) => state.auth.user);
  const userDetails = useSelector((state) => state.userData.userDetails);
  const loading = useSelector((state) => state.userData.loading);
  const error = useSelector((state) => state.userData.error);

  const isMe = useMemo(() => {
    if (!routeUserId && authUser) return true;
    if (!authUser || !routeUserId) return false;
    return authUser.userId === routeUserId;
  }, [authUser, routeUserId]);

  const effectiveUserId = useMemo(() => {
    if (routeUserId) return routeUserId;
    return authUser?.userId ?? null;
  }, [authUser, routeUserId]);

  // carico il profilo giusto (mio o di un altro)
  useEffect(() => {
    if (!effectiveUserId) return;

    dispatch(
      loadUserDetails(effectiveUserId, {
        publicProfile: !isMe, // se non è il mio, chiede il profilo pubblico
      }),
    );
  }, [effectiveUserId, isMe, dispatch]);

  // lista giochi (backend gestisce già private/public, ma lato front filtro di sicurezza)
  const allGames = userDetails?.games ?? [];
  const visibleGames = useMemo(() => {
    if (isMe) return allGames;
    return allGames.filter((g) => g.isReviewPublic);
  }, [allGames, isMe]);

  // stats semplici
  const stats = useMemo(() => {
    if (!visibleGames.length) {
      return { total: 0, completed: 0, playing: 0, avgRating: 0 };
    }

    const total = visibleGames.length;
    const completed = visibleGames.filter((g) => g.status === "Completed").length;
    const playing = visibleGames.filter((g) => g.status === "Playing").length;

    const rated = visibleGames.filter((g) => typeof g.rating === "number" && g.rating > 0);
    const avgRating = rated.length > 0 ? Number((rated.reduce((sum, g) => sum + (g.rating ?? 0), 0) / rated.length).toFixed(1)) : 0;

    return { total, completed, playing, avgRating };
  }, [visibleGames]);

  // PATCH UserGame
  const handleUpdateUserGame = useCallback(
    async (userGameId, patch) => {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        const res = await fetch(`${baseUrl}/api/UserGames/UpdateUserGame/${userGameId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: authUser?.token ? `Bearer ${authUser.token}` : "",
          },
          body: JSON.stringify(patch),
        });

        if (!res.ok) {
          throw new Error("Errore durante l'aggiornamento del gioco");
        }

        if (effectiveUserId) {
          dispatch(
            loadUserDetails(effectiveUserId, {
              publicProfile: !isMe,
            }),
          );
        }
      } catch (err) {
        console.error(err);
        alert("Non sono riuscito ad aggiornare il gioco, riprova più tardi.");
      }
    },
    [authUser, dispatch, effectiveUserId, isMe],
  );

  // DELETE UserGame
  const handleDeleteUserGame = useCallback(
    async (userGameId) => {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        const res = await fetch(`${baseUrl}/api/UserGames/DeleteUserGame/${userGameId}`, {
          method: "DELETE",
          headers: {
            Authorization: authUser?.token ? `Bearer ${authUser.token}` : "",
          },
        });

        if (!res.ok) {
          throw new Error("Errore durante la cancellazione del gioco");
        }

        if (effectiveUserId) {
          dispatch(
            loadUserDetails(effectiveUserId, {
              publicProfile: !isMe,
            }),
          );
        }
      } catch (err) {
        console.error(err);
        alert("Non sono riuscito a rimuovere il gioco, riprova più tardi.");
      }
    },
    [authUser, dispatch, effectiveUserId, isMe],
  );

  // ================= RENDER STATE =================

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
      <div className="container">
        <ProfileHeader username={userDetails.userName} stats={stats} isMe={isMe} />

        <ProfileGameSection games={visibleGames} isMe={isMe} onUpdate={handleUpdateUserGame} onDelete={handleDeleteUserGame} />
      </div>
    </section>
  );
};

export default ProfilePage;
