import axios from "axios";
import React, { useEffect, useState } from "react";

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [choices, setChoices] = useState([]);
  const [choiceById, setChoiceById] = useState([]);
  const [checked, setChecked] = useState(false);

  const questions = JSON.parse(localStorage.getItem("QuestionByIdQuiz"));

  const handleNext = () => {
    if (currentQuestion === questions.length) {
      return setCurrentQuestion(currentQuestion);
    }
    return setCurrentQuestion(currentQuestion + 1);
  };

  const handlePrevious = () => {
    if (currentQuestion === 1) {
      return setCurrentQuestion(currentQuestion);
    }
    return setCurrentQuestion(currentQuestion - 1);
  };

  const handleCalculateScore = () => {
    let answer = JSON.parse(localStorage.getItem("data_answer"));
    let result = 0;
    answer.forEach((answer, index) => {
      choices.forEach((choice) => {
        if (choice.id === answer.id_choice && choice.is_true) {
          result += questions[index].score;
        }
      });
    });
    console.log("Score: ", result);
    return result;
  };

  const onChangeRadio = (value, index) => {
    let answer = JSON.parse(localStorage.getItem("data_answer"));
    answer[index - 1] = JSON.parse(value);
    console.log(JSON.parse(value));
    localStorage.setItem("data_answer", JSON.stringify(answer));

    const convertValue = JSON.parse(value);
    checkData(convertValue.id_choice, index);
    setChecked(!checked);
  };

  const checkData = (id, index) => {
    let answer = JSON.parse(localStorage.getItem("data_answer"));
    if (answer[index - 1] && answer[index - 1].id_choice === id) {
      return true;
    }

    return false;
  };

  useEffect(() => {
    axios
      .get("https://616981a909e030001712c409.mockapi.io/choices/")
      .then((response) => {
        setChoices(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    setChoiceById(
      choices.filter(
        (choice) => choice.id_question === questions[currentQuestion - 1].id
      )
    );
  }, [currentQuestion, choices]);

  return (
    <div className="container p-8">
      <div className="flex flex-col">
        <div className="w-full dark:bg-yellow-100 rounded-full h-1.5 bg-yellow-100">
          <div
            className="dark:bg-yellow-500 h-1.5 rounded-full bg-yellow-500"
            style={{ width: `${(currentQuestion / questions.length) * 100}%` }}
          ></div>
        </div>
        <div className="flex flex-row justify-between mt-6">
          <div
            className="text-white bg-blue-700 hover:bg-blue-800 cursor-pointer rounded text-sm px-5 py-2.5 text-center"
            onClick={handlePrevious}
          >
            Previous
          </div>
          <div>00:00:00</div>
        </div>
        <div className="flex flex-col items-center self-center w-10/12 mt-8">
          <div className="text-base font-bold text-center mb-2">
            Question {currentQuestion}/{questions.length}
          </div>
          <div className="text-base font-normal text-center mb-8">
            {questions[currentQuestion - 1].question}
          </div>
          <div className="flex flex-col gap-2 w-2/4">
            {choiceById.map((data, index) => (
              <div
                className={`flex items-center ${
                  checkData(data.id, currentQuestion)
                    ? "bg-green-300"
                    : "bg-slate-200"
                } rounded-lg py-2 px-4 cursor-pointer hover:bg-green-300 active:bg-green-300`}
                key={index}
                onChange={(e) => onChangeRadio(e.target.value, currentQuestion)}
              >
                <input
                  id={index}
                  type="radio"
                  checked={checkData(data.id, currentQuestion)}
                  value={JSON.stringify({
                    id_question: data.id_question,
                    id_choice: data.id,
                  })}
                  name={index}
                  className="appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-green-600 checked:border-green-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                />
                <label
                  for={index}
                  className="ml-2 text-sm font-medium text-black cursor-pointer"
                >
                  {data.choice}
                </label>
              </div>
            ))}
          </div>
          {currentQuestion === questions.length ? (
            <button
              type="button"
              class="text-white bg-green-700 hover:bg-green-800 font-medium rounded text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 mt-10"
              onClick={handleCalculateScore}
            >
              Finish
            </button>
          ) : (
            <button
              type="button"
              class="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 mt-10"
              onClick={handleNext}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
