import { ArrowLeftCircle, ArrowRightCircle } from "react-bootstrap-icons";
import "./BottomButtonBar.css";
import "./Common.css";

function BottomButtonBar({
  previousTitle,
  nextTitle,
  handlePrevious,
  handleNext,
}) {
  return (
    <div className="bottomnav" role="navigation" aria-label="Track navigation">
      <div className="bottomnav-gradient" aria-hidden="true" />

      {previousTitle ? (
        <button
          onClick={handlePrevious}
          type="button"
          className="bottomnav-item bottomnav-prev"
          aria-label={`Previous: ${previousTitle}`}
        >
          <ArrowLeftCircle className="bottomnav-icon" />
          <span className="bottomnav-text">{previousTitle}</span>
        </button>
      ) : null}

      {nextTitle ? (
        <button
          onClick={handleNext}
          type="button"
          className="bottomnav-item bottomnav-next"
          aria-label={`Next: ${nextTitle}`}
        >
          <span className="bottomnav-text">{nextTitle}</span>
          <ArrowRightCircle className="bottomnav-icon" />
        </button>
      ) : null}
    </div>
  );
}

export default BottomButtonBar;
