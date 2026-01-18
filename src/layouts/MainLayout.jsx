import { Outlet } from "react-router";
import MyNavbar from "../components/navbar/MyNavbar";
import { useSelector } from "react-redux";

export default function MainLayout() {
  const user = useSelector((state) => state.auth.user);

  return (
    <div>
      <MyNavbar user={user} />
      <main>
        <Outlet />
      </main>
      <footer className="lx-footer mt-5">
        <div className="container">
          <div className="text-center py-4">
            <p className="mb-0 text-muted">© 2026 Ludex - La tua libreria gaming</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
