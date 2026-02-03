import { useEffect, useMemo, useRef } from "react";
import { Search, X } from "react-bootstrap-icons";
import "./TrackMenu.css";
import "./LyricsSearch.css";

function LyricsSearch({
  open,
  onClose,
  query,
  onChangeQuery,
  results,
  onSelectResult,
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    // Focus after paint so mobile keyboards behave better.
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  const normalizedQuery = useMemo(() => (query ?? "").trim(), [query]);

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
        aria-label="Lyrics search"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="trackmenu-header">
          <div className="trackmenu-title">Search</div>
          <button
            type="button"
            className="trackmenu-close"
            onClick={() => onClose?.()}
            aria-label="Close search"
          >
            <X />
          </button>
        </div>

        <div className="searchbar">
          <Search className="searchbar-icon" />
          <input
            ref={inputRef}
            className="searchbar-input"
            value={query}
            onChange={(e) => onChangeQuery?.(e.target.value)}
            placeholder="가사에서 키워드 검색"
            aria-label="Search lyrics"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
          />
          {query ? (
            <button
              type="button"
              className="searchbar-clear"
              onClick={() => onChangeQuery?.("")}
              aria-label="Clear"
            >
              <X />
            </button>
          ) : null}
        </div>

        <div className="searchmeta">
          {normalizedQuery ? (
            <div className="searchmeta-text">
              {results.length} result{results.length === 1 ? "" : "s"}
            </div>
          ) : (
            <div className="searchmeta-text">검색어를 입력해줘</div>
          )}
        </div>

        <nav className="trackmenu-list" aria-label="Search results">
          {normalizedQuery ? (
            results.length ? (
              results.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  className="trackmenu-item search-item"
                  onClick={() => onSelectResult?.(r)}
                >
                  <div className="trackmenu-item-main">{r.trackTitle}</div>
                  <div className="search-item-meta">
                    {r.speaker ? r.speaker : "(no speaker)"}
                  </div>
                  <div className="search-item-snippet">
                    {r.snippetLines.map((line, idx) => (
                      <div key={`${r.id}-snip-${idx}`} className="search-item-line">
                        {line}
                      </div>
                    ))}
                  </div>
                </button>
              ))
            ) : (
              <div className="search-empty">No matches</div>
            )
          ) : null}
        </nav>
      </aside>
    </div>
  );
}

export default LyricsSearch;
