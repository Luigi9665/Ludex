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
    </div>
  );
}
