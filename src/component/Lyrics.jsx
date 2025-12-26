function Lyrics(props) {
  const track = props.track;

  console.log(track);

  return (
    <>
      <h2>{`${track.order}. ${track.title_ko} | ${track.title_en}`}</h2>

      {track
        ? track.lyrics_raw.map((lyric) => {
            return (
              <>
                <h3>{lyric.speaker}</h3>
                <p style={{ whiteSpace: "pre-wrap" }}>{lyric.lyrics}</p>
              </>
            );
          })
        : null}
    </>
  );
}

export default Lyrics;
