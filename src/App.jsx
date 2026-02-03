import { Navigate, Route, Routes } from "react-router";
import "./App.css";
import "./styles/AdminFormStyles.css";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import MainLayout from "./layouts/MainLayout";
import AdminCreateGamePage from "./pages/admin/AdminCreateGamePage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import NotFoundPage from "./pages/NotFoundPage";
import LibraryPage from "./components/Library/LibraryPage";
import GameDetailPage from "./pages/GameDetailPage";
import ProfilePage from "./pages/ProfilePage";
import AdminGameListPage from "./pages/admin/AdminGameListPage";
import AdminEditGamePage from "./pages/admin/AdminEditGamePage";
import QuestionnairePage from "./pages/QuestionnairePage";
import RecommendationsPage from "./pages/RecommendationsPage";
import AnalyticsOverviewPage from "./pages/admin/AnalyticsOverviewPage";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminGenresPage from "./pages/admin/AdminGenresPage";
import AdminTagsPage from "./pages/admin/AdminTagsPage";
import AdminMetadataPage from "./pages/admin/AdminMetadataPage";
import AdminQuestionsPage from "./pages/admin/AdminQuestionsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth" />} />

      <Route path="/auth" element={<AuthPage />} />

      <Route element={<MainLayout />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/library" element={<LibraryPage />} />

        {/* nuova pagina dettaglio */}
        <Route path="/game/:gameId" element={<GameDetailPage />} />

        {/* nuova pagina profilo */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/:userId" element={<ProfilePage />} />

        {/* nuova pagina questionario */}
        <Route path="/questionnaire" element={<QuestionnairePage />} />

        {/* 👇 nuova pagina risultati questionario */}
        <Route path="/recommendations" element={<RecommendationsPage />} />
      </Route>

      {/* Rotta singola per l'area admin */}
      <Route path="/admin" element={<AdminLayout />}>
        {/* index = /admin → dashboard analytics */}
        <Route index element={<AnalyticsOverviewPage />} />

        {/* Giochi */}
        <Route path="games" element={<AdminGameListPage />} />
        <Route path="games/new" element={<AdminCreateGamePage />} />
        <Route path="games/:id/edit" element={<AdminEditGamePage />} />

        {/* 👇 NUOVE PAGINE ADMIN */}
        <Route path="genres" element={<AdminGenresPage />} />
        <Route path="tags" element={<AdminTagsPage />} />
        <Route path="metadata" element={<AdminMetadataPage />} />
        <Route path="questions" element={<AdminQuestionsPage />} />
      </Route>

      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
