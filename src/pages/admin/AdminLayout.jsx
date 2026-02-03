import React, { useEffect, useState } from "react";
import { Outlet } from "react-router";
import Sidebar from "./Sidebar";
import AdminHeader from "./AdminHeader";

// importa gli stili della dashboard solo qui
import "../../styles/Analytics/Analytics.css";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

/**
 * Shell principale dell'area admin.
 * Gestisce:
 * - sidebar (desktop + mobile)
 * - header
 * - contenuto centrale tramite <Outlet />
 */
export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const authUser = useSelector((state) => state.auth.user);

  const isAdmin = authUser?.role === "Admin";

  // se non sei admin → via
  useEffect(() => {
    if (!isAdmin) {
      navigate("/unauthorized");
    }
  }, [isAdmin, navigate]);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className="lx-admin-shell">
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

      <div className="lx-admin-content">
        <AdminHeader onToggleSidebar={toggleSidebar} />

        <main className="lx-admin-main">
          <div className="container-fluid">
            {/* Qui viene renderizzata la pagina in base alla rotta (/admin, /admin/games, ecc.) */}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
