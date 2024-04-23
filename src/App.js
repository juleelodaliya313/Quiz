import React, { Component } from "react";
import { QUESTIONS } from "./questions";
import { totalRuns } from "./totalRuns";

// Import your CSS file with animations

class App extends Component {
  constructor(props) {
    super(props);
    const storedAnswers = localStorage.getItem("answers");
    const storedScores = localStorage.getItem("allScores");
    const totalClicks = localStorage.getItem("totalClicks");
    const storedScore = localStorage.getItem("score");
    this.state = {
      answers: storedAnswers ? JSON.parse(storedAnswers) : {},
      score: storedScore ? parseFloat(storedScore) : 0,
      allScores: storedScores ? JSON.parse(storedScores) : [],
      averageRating: 0,
      totalClicks: JSON.parse(totalClicks) ? JSON.parse(totalClicks) : 0,
      avrageClicks: 10,
    };
  }



  handleAnswer = (questionId, answer) => {
    const updatedAnswers = { ...this.state.answers, [questionId]: answer };
    const score = this.calculateScore(updatedAnswers);
    this.setState({
      answers: updatedAnswers,
      score: score
    });
    localStorage.setItem("answers", JSON.stringify(updatedAnswers)); // Store answers in local storage
    localStorage.setItem("score", score.toFixed(2)); // Store score in local storage
  };

  calculateScore = (answers) => {
    const yesCount = Object.values(answers).filter((answer) => answer === "Yes").length;
    const totalCount = Object.keys(answers).length;
    return (yesCount / totalCount) * 100;
  };

  rerunApp = () => {
    this.setState(prev => ({
      answers: {},
      score: 0,
      totalClicks: prev.totalClicks + 1,
      averageRating: 0,
    }), () => {
      localStorage.setItem("totalClicks", JSON.stringify(this.state.totalClicks));
    });
    console.log("🚀 ~ App ~ totalClicks:", this.state.totalClicks)
    localStorage.removeItem("answers"); // Clear answers from local storage
    localStorage.removeItem("score"); // Clear score from local storage
  };







  componentDidUpdate(prevProps, prevState) {
    const { allScores, score } = this.state;
    if (prevState.score !== score) {
      const updatedScores = [...allScores, score];
      localStorage.setItem("allScores", JSON.stringify(updatedScores));
      const averageRating = updatedScores.length > 0 ? updatedScores.reduce((a, b) => a + b) / updatedScores.length : 0;
      this.setState({ averageRating });
    }
  }



  render() {
    const { score, answers, averageRating } = this.state;
    return (
      <div className="main__wrap">
        <main className="container text-center bg-white shadow ">
          {Object.entries(QUESTIONS).map(([id, question], i) => (
            <div key={id} className="mb-3 answer-animation">
              {answers[id] ? (
                <>
                  {answers[id] === "Yes" ? (
                    <div className={answers[id] === "Yes" ? "fade-in text-success" : "fade-out"}>
                      <p>{(i + 1) + '. ' + question}</p>
                      <p>Yes, I can code with {question.replace("Can you code in", "").trim().slice(0, -1)}</p>
                    </div>
                  ) : (
                    <div className={answers[id] === "No" ? "fade-in text-danger" : "fade-out"}>
                      <p>{(i + 1) + '. ' + question}</p>
                      <p>No, I cannot code with {question.replace("Can you code in", "").trim().slice(0, -1)}</p>
                    </div>
                  )}
                </>
              ) : (
                <div>
                  <p>{(i + 1) + '. ' + question}</p>
                  <button className="btn btn-primary me-2" onClick={() => this.handleAnswer(id, "Yes")}>A. Yes</button>
                  <button className="btn btn-danger" onClick={() => this.handleAnswer(id, "No")}>B. No</button>
                </div>
              )}
            </div>
          ))}
          <div className="mt-4">
            <p>Score: {score.toFixed(2)}</p>
            {/* <p>Average Rating: {(this.state.avrageClicks - totalRuns) * 100 / this.state.avrageClicks}%</p> */}
            {/* <p>Average Rating: {(this.state.avrageClicks - this.state.totalClicks) * 100 / this.state.avrageClicks}%</p> */}
            <button className="btn btn-success" onClick={this.rerunApp} disabled={Object.entries(this.state.answers).length === Object.entries(QUESTIONS).length ? false : true}>Restart the Quiz</button>
            <h3>Total runs of application: {this.state.totalClicks}</h3>
          </div>
        </main>
      </div>
    );
  }
}

export default App;
