import "./Common.css";

function Lyrics(props) {
  const track = props.track;

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
      <h2 className="heading_2">{`${track.order}. ${track.title_ko} | ${track.title_en}`}</h2>

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

            if (isDuet) {
              return (
                <section className="lyric-block" key={`lyric-${blockIndex}`}>
                  {(speakerLeft || speakerRight) && (
                    <div className="lyric-speaker-row" aria-label="Speakers">
                      <div className="lyric-speaker">
                        {speakerLeft || "\u00A0"}
                      </div>
                      <div className="lyric-speaker">
                        {speakerRight || "\u00A0"}
                      </div>
                    </div>
                  )}
                  <div className="lyric-grid" aria-label="Lyrics">
                    {rows.map((row, rowIndex) => {
                      const leftText = row.left || "";
                      const rightText = row.right || "";
                      const isBlankRow = !leftText && !rightText;

                      return (
                        <div
                          className="lyric-row"
                          key={`lyric-${blockIndex}-row-${rowIndex}`}
                        >
                          <div className="lyric-col">
                            {isBlankRow ? "\u00A0" : leftText || "\u00A0"}
                          </div>
                          <div className="lyric-col">
                            {isBlankRow ? "\u00A0" : rightText || "\u00A0"}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            }

            return (
              <section className="lyric-block" key={`lyric-${blockIndex}`}>
                {String(lyric.speaker ?? "").trim() ? (
                  <h3 className="heading_3">{lyric.speaker}</h3>
                ) : null}
                <p className="paragraph">{lyric.lyrics}</p>
              </section>
            );
          })
        : null}
    </>
  );
}

export default Lyrics;
