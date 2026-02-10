import { Gamepad2, Trophy, TrendingUp, Star, BookOpen } from "lucide-react";
import avatar from "../../assets/avatar.png";

const ProfilePanelLeft = ({ username, stats, isMe }) => {
  return (
    <aside className="lx-profile-panel">
      <div className="lx-profile-avatar-section">
        <div className="lx-profile-avatar-container">
          <div className="lx-profile-avatar-ring" />
          <img src={avatar} alt={username} className="lx-profile-avatar-img" />
        </div>

        <h1 className="lx-profile-username-display">
          @{username}
          {isMe && <span className="lx-profile-badge-me">Tu</span>}
        </h1>

        <p className="lx-profile-bio">{isMe ? "La tua libreria gaming personale su Ludex." : "Profilo pubblico di questo giocatore."}</p>
      </div>

      <div className="lx-profile-stats-grid">
        <div className="lx-profile-stat-pill">
          <Gamepad2 className="lx-profile-stat-pill-icon" size={20} />
          <span className="lx-profile-stat-pill-value">{stats.total}</span>
          <span className="lx-profile-stat-pill-label">Giochi</span>
        </div>

        <div className="lx-profile-stat-pill">
          <Trophy className="lx-profile-stat-pill-icon" size={20} />
          <span className="lx-profile-stat-pill-value">{stats.completed}</span>
          <span className="lx-profile-stat-pill-label">Completati</span>
        </div>

        <div className="lx-profile-stat-pill">
          <TrendingUp className="lx-profile-stat-pill-icon" size={20} />
          <span className="lx-profile-stat-pill-value">{stats.playing}</span>
          <span className="lx-profile-stat-pill-label">In corso</span>
        </div>

        <div className="lx-profile-stat-pill">
          <Star className="lx-profile-stat-pill-icon" size={20} />
          <span className="lx-profile-stat-pill-value">{stats.avgRating}</span>
          <span className="lx-profile-stat-pill-label">Rating</span>
        </div>

        <div className="lx-profile-stat-pill">
          <BookOpen className="lx-profile-stat-pill-icon" size={20} />
          <span className="lx-profile-stat-pill-value">{stats.reviewsCount}</span>
          <span className="lx-profile-stat-pill-label">Recensioni</span>
        </div>

        <div className="lx-profile-stat-pill">
          <Gamepad2 className="lx-profile-stat-pill-icon" size={20} />
          <span className="lx-profile-stat-pill-value">{stats.backlog}</span>
          <span className="lx-profile-stat-pill-label">Backlog</span>
        </div>
      </div>
    </aside>
  );
};

export default ProfilePanelLeft;
