import { useEffect, useMemo, useState } from "react";
import "./App.css";
import AppBar from "./component/AppBar";
import BottomButtonBar from "./component/BottomButtonBar";
import Lyrics from "./component/Lyrics";
import LyricsSearch from "./component/LyricsSearch";
import TrackMenu from "./component/TrackMenu";
import lyricsData from "./evita_lyrics.json";

function App() {
  const data = lyricsData;
  const [act, setAct] = useState(0);
  const [index, setIndex] = useState(0);
  const [trackNumber, setTrackNumber] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeHighlight, setActiveHighlight] = useState(null);

  const clearHighlight = ({ clearQuery } = { clearQuery: false }) => {
    setActiveHighlight(null);
    if (clearQuery) setSearchQuery("");
  };

  console.log(data.acts[1]);

  const calculateActAndIndex = (newIndex) => {
    console.log(newIndex, newIndex - 12);
    if (newIndex < 0 || newIndex >= 26) {
      return;
    }

    const scrollToTopInstant = () => {
      const root = document.documentElement;
      const previousBehavior = root.style.scrollBehavior;
      root.style.scrollBehavior = "auto";
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.body.scrollTop = 0;
      root.scrollTop = 0;
      root.style.scrollBehavior = previousBehavior;
    };

    // Ensure we land at the top without any smooth animation.
    scrollToTopInstant();
    requestAnimationFrame(scrollToTopInstant);

    let newAct = 0;
    let newTrackNumber = newIndex;

    if (newIndex >= 12) {
      newAct = 1;
      newTrackNumber = newIndex - 12;
    }

    setAct(newAct);
    setTrackNumber(newTrackNumber);
    setIndex(newIndex);
  };

  const getTitle = (index) => {
    console.log(index, index - 12);
    if (index < 0 || index >= 26) {
      return "";
    }

    let act = 0;
    let trackNumber = index;

    if (index >= 12) {
      act = 1;
      trackNumber = index - 12;
    }

    let track = data.acts[act].tracks[trackNumber];
    console.log(`${track.order}. ${track.title_ko}`);
    return `${track.order}. ${track.title_ko}`;
  };

  const trackMenuItems = data.acts.flatMap((actData, actIndex) =>
    actData.tracks.map((track, trackIndex) => {
      const globalIndex = actIndex === 0 ? trackIndex : 12 + trackIndex;
      return {
        index: globalIndex,
        title: `${track.order}. ${track.title_ko}`,
        subtitle: track.title_en ? track.title_en : "",
      };
    }),
  );

  const searchResults = useMemo(() => {
    const q = (searchQuery ?? "").trim().toLowerCase();
    if (!q) return [];

    const results = [];

    data.acts.forEach((actData, actIndex) => {
      actData.tracks.forEach((track, trackIndex) => {
        const globalIndex = actIndex === 0 ? trackIndex : 12 + trackIndex;
        const trackTitle = `${track.order}. ${track.title_ko}`;

        (track.lyrics_raw ?? []).forEach((block, blockIndex) => {
          const speaker = (block.speaker ?? "").toString().trim();
          const lines = (block.lyrics ?? "").toString().split("\n");

          lines.forEach((line, lineIndex) => {
            const normalizedLine = (line ?? "").toString().toLowerCase();
            if (!normalizedLine.includes(q)) return;

            const nextLine = lines[lineIndex + 1];
            const prevLine = lines[lineIndex - 1];
            const snippetLines = [
              lines[lineIndex] ?? "",
              typeof nextLine === "string" ? nextLine : typeof prevLine === "string" ? prevLine : "",
            ].filter((s) => s !== undefined && s !== null);

            results.push({
              id: `${globalIndex}-${blockIndex}-${lineIndex}`,
              index: globalIndex,
              trackTitle,
              speaker,
              snippetLines,
              blockIndex,
              lineIndex,
            });
          });
        });
      });
    });

    return results.slice(0, 100);
  }, [data.acts, searchQuery]);

  useEffect(() => {
    if (!activeHighlight?.query) return;

    const onPointerDown = (e) => {
      const keep = e.target?.closest?.('[data-search-highlight="true"]');
      if (keep) return;
      clearHighlight({ clearQuery: true });
    };

    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [activeHighlight?.query]);

  const increaseIndex = () => {
    calculateActAndIndex(index + 1);
  };

  const decreaseIndex = () => {
    calculateActAndIndex(index - 1);
  };

  return (
    <div className="App">
      <AppBar
        onMenuClick={() => {
          setIsMenuOpen(true);
          setIsSearchOpen(false);
          clearHighlight({ clearQuery: Boolean(activeHighlight?.query) });
        }}
        onSearchClick={() => {
          setIsSearchOpen(true);
          setIsMenuOpen(false);
          clearHighlight({ clearQuery: Boolean(activeHighlight?.query) });
        }}
      />
      <TrackMenu
        open={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        items={trackMenuItems}
        currentIndex={index}
        onSelectIndex={(nextIndex) => {
          setIsMenuOpen(false);
          clearHighlight({ clearQuery: Boolean(activeHighlight?.query) });
          calculateActAndIndex(nextIndex);
        }}
      />
      <LyricsSearch
        open={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        query={searchQuery}
        onChangeQuery={setSearchQuery}
        results={searchResults}
        onSelectResult={(r) => {
          setIsSearchOpen(false);

          const blockId = `lyric-block-${r.blockIndex}`;
          const rowId = `lyric-hit-${r.blockIndex}-${r.lineIndex}`;
          setActiveHighlight({
            query: searchQuery,
            index: r.index,
            blockId,
            rowId,
          });
          calculateActAndIndex(r.index);
        }}
      />
      <Lyrics track={data.acts[act].tracks[trackNumber]} highlight={activeHighlight} />
      <BottomButtonBar
        previousTitle={getTitle(index - 1)}
        nextTitle={getTitle(index + 1)}
        handlePrevious={() => {
          clearHighlight({ clearQuery: Boolean(activeHighlight?.query) });
          decreaseIndex();
        }}
        handleNext={() => {
          clearHighlight({ clearQuery: Boolean(activeHighlight?.query) });
          increaseIndex();
        }}
      />
    </div>
  );
}

export default App;
