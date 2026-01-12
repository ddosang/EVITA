import "./BottomButtonBar.css";
import { ArrowLeftCircle, ArrowRightCircle } from 'react-bootstrap-icons';

function BottomButtonBar({ handlePrevious, handleNext }) {
  return (
    <>
      <button onClick={handlePrevious} type="button" className="btn btn-info btn-prev">
       <ArrowLeftCircle></ArrowLeftCircle>
      </button>
      <button onClick={handleNext} type="button" className="btn btn-info btn-next">
        <ArrowRightCircle></ArrowRightCircle>
      </button>
    </>
  );
}

export default BottomButtonBar;
