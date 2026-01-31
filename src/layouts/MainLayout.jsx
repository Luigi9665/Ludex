import { Outlet } from "react-router";
import MyNavbar from "../components/navbar/MyNavbar";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { loadUserDetails } from "../redux/action";

export default function MainLayout() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const { loaded, loading } = useSelector((state) => state.userData);

  useEffect(() => {
    if (user?.userId && !loaded && !loading) {
      dispatch(loadUserDetails(user.userId));
    }
  }, [user?.userId, loaded, loading, dispatch]);

  return (
    <div className="lx-app-shell">
      <MyNavbar user={user} />
      <main className="lx-main lx-main-with-nav">
        <Outlet />
      </main>
      <footer className="lx-footer">
        <div className="container">
          <div className="text-center py-4">
            <p className="mb-0 text-white-50">© 2026 Ludex - La tua libreria gaming V1</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
