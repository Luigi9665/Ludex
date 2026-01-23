import { Gamepad2, Trophy, TrendingUp, Star as StarIcon } from "lucide-react";
import avatar from "../../assets/avatar.png";

const ProfileHeader = ({ username, stats, isMe }) => {
  return (
    <div className="lx-profile-hero lx-glow-card mb-4">
      <div className="lx-profile-hero-inner">
        {/* Avatar + username */}
        <div className="lx-profile-hero-left">
          <div className="lx-profile-avatar-wrapper">
            <img src={avatar} alt={username} className="lx-profile-avatar-img" />
          </div>

          <div className="lx-profile-hero-text">
            <div className="d-flex align-items-center gap-2">
              <h1 className="lx-profile-username">@{username}</h1>
              {isMe && <span className="lx-profile-badge-own">Tu</span>}
            </div>
            <p className="lx-profile-subtitle">{isMe ? "Questa è la tua libreria personale su Ludex." : "Libreria pubblica di questo giocatore."}</p>
          </div>
        </div>

        {/* Statistiche */}
        <div className="lx-profile-hero-stats">
          <div className="lx-profile-stat">
            <Gamepad2 className="lx-profile-stat-icon" size={22} />
            <div className="lx-profile-stat-number">{stats.total}</div>
            <div className="lx-profile-stat-label">Giochi</div>
          </div>
          <div className="lx-profile-stat">
            <Trophy className="lx-profile-stat-icon" size={22} />
            <div className="lx-profile-stat-number">{stats.completed}</div>
            <div className="lx-profile-stat-label">Completati</div>
          </div>
          <div className="lx-profile-stat">
            <TrendingUp className="lx-profile-stat-icon" size={22} />
            <div className="lx-profile-stat-number">{stats.playing}</div>
            <div className="lx-profile-stat-label">In corso</div>
          </div>
          <div className="lx-profile-stat">
            <StarIcon className="lx-profile-stat-icon" size={22} />
            <div className="lx-profile-stat-number">{stats.avgRating}</div>
            <div className="lx-profile-stat-label">Rating medio</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
