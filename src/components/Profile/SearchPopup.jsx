import { useEffect, useRef } from "react";
import ReactDOM from "react-dom";

const SearchPopup = ({ open, value, onChange, onClose }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && open) {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  const content = (
    <div className="lx-search-popup-overlay" onClick={onClose}>
      <div className="lx-search-popup-card" onClick={(e) => e.stopPropagation()}>
        <input
          ref={inputRef}
          type="text"
          className="lx-search-popup-input"
          placeholder="Cerca un gioco per titolo..."
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
        />
        <p className="lx-search-popup-hint">
          Premi <kbd>ESC</kbd> per chiudere
        </p>
      </div>
    </div>
  );

  return ReactDOM.createPortal(content, document.body);
};

export default SearchPopup;
