import { useEffect, useState } from "react";
import "./App.css";
import Card from "./component/Card";
import Quizzical from "./component/Quizzical";

const welcomePage = (
  <div className="intro-page">
    <h2>Quizzical</h2>
    <p>Welcome to Quizzical. Click on Start Quiz to begin!</p>
  </div>
);

function App() {
  const [hasQuiz, setHasQuiz] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [quiz, setQuiz] = useState([]);
  const [loading, setLoading] = useState(false); // Track loading state
  const [error, setError] = useState(null); // Track API error
  const [retryAttempts, setRetryAttempts] = useState(0); // Retry counter

  const fetchQuiz = async (attempt = 1) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple"
      );

      if (!response.ok) {
        throw new Error(
          response.status === 429
            ? "Too many requests. Please try again later."
            : "Failed to fetch quiz data."
        );
      }

      const data = await response.json();
      setQuiz(data.results);
      console.log("Quiz data fetched:", data.results);
    } catch (err) {
      console.error("Error fetching quiz:", err);
      setError(err.message);

      // Retry with exponential backoff
      if (attempt <= 3) {
        console.log(`Retrying API call (attempt ${attempt})...`);
        setTimeout(() => fetchQuiz(attempt + 1), attempt * 1000); // Delay increases with attempt
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, [retryAttempts]);

  const handleClick = () => {
    if (hasQuiz && showResult) {
      // Reset quiz state
      setHasQuiz(false);
      setShowResult(false);
      setRetryAttempts((prev) => prev + 1); // Trigger a re-fetch
    } else {
      setHasQuiz(true);
    }
  };

  const getResult = (result) => {
    setShowResult(result);
  };

  const buttonLabel =
    hasQuiz && showResult ? "Try Again" : hasQuiz ? "" : "Start Quiz";

  return (
    <>
      <Card>
        {loading && <p>Loading quiz data...</p>}
        {error && (
          <p className="error">
            {`Error: ${error}`}
            <br />
            <button
              onClick={() => setRetryAttempts((prev) => prev + 1)}
              style={{ marginTop: "10px" }}
            >
              Retry
            </button>
          </p>
        )}
        {!loading && !error && (
          <>
            {hasQuiz ? (
              <Quizzical quizs={quiz} onGetResult={getResult} />
            ) : (
              welcomePage
            )}
          </>
        )}
        <button
          onClick={handleClick}
          disabled={loading || error !== null}
          style={{
            display: !buttonLabel ? "none" : "",
            backgroundColor: loading ? "#ccc" : "",
            cursor: loading ? "not-allowed" : "",
          }}
        >
          {buttonLabel}
        </button>
      </Card>
    </>
  );
}

export default App;
