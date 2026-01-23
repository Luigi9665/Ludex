export const STATUS_CONFIG = {
  Playing: {
    color: "#00f2ff",
    gradient: "linear-gradient(135deg, #00f2ff, #0066ff)",
    label: "In corso",
    icon: "▶️",
  },
  Completed: {
    color: "#00ff88",
    gradient: "linear-gradient(135deg, #00ff88, #00cc66)",
    label: "Completato",
    icon: "✓",
  },
  Backlog: {
    color: "#ffaa00",
    gradient: "linear-gradient(135deg, #ffaa00, #ff6600)",
    label: "Da giocare",
    icon: "📚",
  },
  Paused: {
    color: "#ff00ff",
    gradient: "linear-gradient(135deg, #ff00ff, #cc00ff)",
    label: "In pausa",
    icon: "⏸️",
  },
  Dropped: {
    color: "#ff4444",
    gradient: "linear-gradient(135deg, #ff4444, #cc0000)",
    label: "Abbandonato",
    icon: "✕",
  },
};

export const STATUS_ORDER = ["Playing", "Backlog", "Completed", "Paused", "Dropped"];
