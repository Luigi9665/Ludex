import { Navigate, Route, Routes } from "react-router";
import "./App.css";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import MainLayout from "./layouts/MainLayout";
import AdminCreateGamePage from "./pages/admin/AdminCreateGamePage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import NotFoundPage from "./pages/NotFoundPage";
import LibraryPage from "./components/Library/LibraryPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth" />} />

      <Route path="/auth" element={<AuthPage />} />

      <Route element={<MainLayout />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/library" element={<LibraryPage />} />
      </Route>

      <Route path="/admin/games/new" element={<AdminCreateGamePage />} />

      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
