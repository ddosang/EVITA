import { useEffect } from "react";
import { X } from "react-bootstrap-icons";
import "./AppBar.css";
import "./TrackMenu.css";

function TrackMenu({ open, onClose, items, currentIndex, onSelectIndex }) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="trackmenu-overlay"
      role="presentation"
      onClick={() => onClose?.()}
    >
      <aside
        className="trackmenu-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="Track list"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="trackmenu-header">
          <div className="trackmenu-title">Tracks</div>
          <button
            type="button"
            className="trackmenu-close"
            onClick={() => onClose?.()}
            aria-label="Close menu"
          >
            <X />
          </button>
        </div>

        <nav className="trackmenu-list" aria-label="Tracks">
          {items.map((item) => {
            const isActive = item.index === currentIndex;
            return (
              <button
                key={`track-${item.index}`}
                type="button"
                className={`trackmenu-item${isActive ? " is-active" : ""}`}
                onClick={() => onSelectIndex?.(item.index)}
              >
                <div className="trackmenu-item-main">{item.title}</div>
                {item.subtitle ? (
                  <div className="trackmenu-item-sub">{item.subtitle}</div>
                ) : null}
              </button>
            );
          })}
        </nav>
      </aside>
    </div>
  );
}

export default TrackMenu;
