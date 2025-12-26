import { useState } from "react";
import "./App.css";
import AppBar from "./component/AppBar";
import BottomButtonBar from "./component/BottomButtonBar";
import Lyrics from "./component/Lyrics";
import lyricsData from "./evita_lyrics.json";

function App() {
  const data = lyricsData;
  const [act, setAct] = useState(0);
  const [index, setIndex] = useState(0);
  const [trackNumber, setTrackNumber] = useState(0);

  console.log(data.acts[1]);

  const calculateActAndIndex = (newIndex) => {
    console.log(newIndex, newIndex - 12);
    if (newIndex < 0 || newIndex >= 26) {
      return;
    }

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

  const increaseIndex = () => {
    calculateActAndIndex(index + 1);
  };

  const decreaseIndex = () => {
    calculateActAndIndex(index - 1);
  };

  return (
    <div className="App">
      <AppBar />
      <Lyrics track={data.acts[act].tracks[trackNumber]} />
      <BottomButtonBar
        handlePrevious={decreaseIndex}
        handleNext={increaseIndex}
      />
    </div>
  );
}

export default App;
