import React from "react";
import "./Quizzical.css";
import he from "he";

function Quizzical(props) {
  console.log()
  const [selectedOptions, setSelectedOptions] = React.useState({}); // Track selected options for each question
  const [showResults, setShowResults] = React.useState(false); // Track if results should be displayed
  const [correctCount, setCorrectCount] = React.useState(0); // Count of correct answers

  const selectOptionHandler = (questionIndex, option) => {
    if (showResults) return; // Prevent changing options after results are shown

    setSelectedOptions((prevSelected) => ({
      ...prevSelected,
      [questionIndex]: option,
    }));
  };

  const calculateResults = () => {
    let correctAnswers = 0;

    props.quizs.forEach((quiz, index) => {
      if (selectedOptions[index] === quiz.correct_answer) {
        correctAnswers++;
      }
    });

    setCorrectCount(correctAnswers);
    setShowResults((prevShow)=>!prevShow);
    props.onGetResult(true); // Notify parent component
  };

  const totalQuestions = props.quizs.length;
  const answeredQuestions = Object.keys(selectedOptions).length;

  const quizsElement = props.quizs.map((quiz, questionIndex) => {
    const allOpt = [...quiz.incorrect_answers, quiz.correct_answer].sort(
      () => Math.random() - 0.5
    ); // Shuffle options

    const quizsOpts = allOpt.map((opt, optionIndex) => {
      const isSelected = selectedOptions[questionIndex] === opt;
      let optionClass = "opt"; // Default class

      if (showResults) {
        if (opt === quiz.correct_answer) {
          optionClass += " correct"; // Mark correct answers
        } else if (isSelected) {
          optionClass += " incorrect"; // Mark incorrect answers
        }
      } else if (isSelected) {
        optionClass += " selected"; // Highlight selected option
      }

      return (
        <div
          className={optionClass}
          key={`${questionIndex}-${optionIndex}`}
          onClick={() => selectOptionHandler(questionIndex, opt)}
        >
          {he.decode(opt)}
        </div>
      );
    });

    return (
      <React.Fragment key={questionIndex}>
        <p className="qus">{`${questionIndex + 1}. ${he.decode(
          quiz.question
        )}`}</p>
        {quizsOpts}
        <hr />
      </React.Fragment>
    );
  });

  return (
    <div>
      <h2>{he.decode(props.quizs[0].category)}</h2>
      {quizsElement}
      <div className="progress" style={{display:answeredQuestions === totalQuestions?"none":""}}>
        <p>{`Answered Questions: ${answeredQuestions} / ${totalQuestions}`}</p>
      </div>
      {!showResults && answeredQuestions === totalQuestions && (
        <button onClick={calculateResults}>Check answers</button>
      )}
      {showResults && (
        <p>{`You got ${correctCount} out of ${totalQuestions} correct!`}</p>
      )}
    </div>
  );
}

export default Quizzical;
