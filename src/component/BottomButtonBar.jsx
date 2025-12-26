function BottomButtonBar({ handlePrevious, handleNext }) {
  return (
    <>
      <button onClick={handlePrevious} type="button" className="btn btn-info">
        Previous
      </button>
      <button onClick={handleNext} type="button" className="btn btn-info">
        Next
      </button>
    </>
  );
}

export default BottomButtonBar;
