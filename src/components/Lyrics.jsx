import { useEffect } from "react";
import "../styles/Common.css";

function Lyrics({ track, highlight }) {
  const highlightQuery = (highlight?.query ?? "").toString().trim();

  const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const renderHighlighted = (text) => {
    const raw = (text ?? "").toString();
    if (!highlightQuery) return raw;

    const re = new RegExp(escapeRegExp(highlightQuery), "gi");
    const parts = [];
    let lastIndex = 0;
    let match;
    while ((match = re.exec(raw)) !== null) {
      const start = match.index;
      const end = start + match[0].length;
      if (start > lastIndex) parts.push(raw.slice(lastIndex, start));
      parts.push(
        <mark
          key={`m-${start}-${end}`}
          className="search-highlight"
          data-search-highlight="true"
        >
          {raw.slice(start, end)}
        </mark>,
      );
      lastIndex = end;
    }
    if (lastIndex < raw.length) parts.push(raw.slice(lastIndex));
    return parts.length ? parts : raw;
  };

  useEffect(() => {
    if (!highlightQuery) return;

    const rowId = highlight?.rowId;
    const blockId = highlight?.blockId;
    const tryScroll = () => {
      const rowEl = rowId ? document.getElementById(rowId) : null;
      const blockEl = blockId ? document.getElementById(blockId) : null;
      const target = rowEl || blockEl;
      if (!target) return;
      target.scrollIntoView({ behavior: "auto", block: "center" });
    };

    requestAnimationFrame(tryScroll);
    requestAnimationFrame(() => requestAnimationFrame(tryScroll));
  }, [highlight?.rowId, highlight?.blockId, highlightQuery]);

  const splitTwoColumns = (text) => {
    const raw = (text ?? "").toString();
    const normalized = raw.replace(/\t+/g, "  ");
    const trimmedRight = normalized.trimEnd();
    if (!trimmedRight) return ["", ""];

    // Treat 2+ whitespace characters as a single column separator (first occurrence).
    // This preserves the original text inside each column while avoiding mobile wrap issues.
    const match = trimmedRight.match(/^(.*?)(?:\s{2,})(\S[\s\S]*)$/);
    if (!match) return [trimmedRight, ""];
    return [match[1].trimEnd(), match[2]];
  };

  return (
    <>
      <h2>{`${track.order}. ${track.title_ko} | ${track.title_en}`}</h2>

      {track
        ? track.lyrics_raw.map((lyric, blockIndex) => {
            const [speakerLeft, speakerRight] = splitTwoColumns(lyric.speaker);
            const lines = (lyric.lyrics ?? "").toString().split("\n");
            const rows = lines.map((line) => {
              const [left, right] = splitTwoColumns(line);
              return { left, right };
            });
            const isDuet =
              Boolean(speakerRight) || rows.some((r) => Boolean(r.right));

            const blockId = `lyric-block-${blockIndex}`;

            if (isDuet) {
              return (
                <section
                  className="lyric-block"
                  key={`lyric-${blockIndex}`}
                  id={blockId}
                >
                  {(speakerLeft || speakerRight) && (
                    <div className="lyric-speaker-row" aria-label="Speakers">
                      <div className="lyric-speaker">
                        {speakerLeft
                          ? renderHighlighted(speakerLeft)
                          : "\u00A0"}
                      </div>
                      <div className="lyric-speaker">
                        {speakerRight
                          ? renderHighlighted(speakerRight)
                          : "\u00A0"}
                      </div>
                    </div>
                  )}
                  <div className="lyric-grid" aria-label="Lyrics">
                    {rows.map((row, rowIndex) => {
                      const leftText = row.left || "";
                      const rightText = row.right || "";
                      const isBlankRow = !leftText && !rightText;
                      const rowId = `lyric-hit-${blockIndex}-${rowIndex}`;

                      return (
                        <div
                          className="lyric-row"
                          key={`lyric-${blockIndex}-row-${rowIndex}`}
                          id={rowId}
                        >
                          <div className="lyric-col">
                            {isBlankRow
                              ? "\u00A0"
                              : leftText
                                ? renderHighlighted(leftText)
                                : "\u00A0"}
                          </div>
                          <div className="lyric-col">
                            {isBlankRow
                              ? "\u00A0"
                              : rightText
                                ? renderHighlighted(rightText)
                                : "\u00A0"}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            }

            return (
              <section
                className="lyric-block"
                key={`lyric-${blockIndex}`}
                id={blockId}
              >
                {String(lyric.speaker ?? "").trim() ? (
                  <h3>{renderHighlighted(lyric.speaker)}</h3>
                ) : null}
                <p className="paragraph">{renderHighlighted(lyric.lyrics)}</p>
              </section>
            );
          })
        : null}
    </>
  );
}

export default Lyrics;
