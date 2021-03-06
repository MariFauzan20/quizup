import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Sidebar from "../../parts/Sidebar";
import { selectUser } from "../../slice/user-slice";

export default function HistoryBoard() {
  const [quiz, setQuiz] = useState([]);
  const [users, setUsers] = useState([]);

  const id = useSelector(selectUser).id;

  const getDataQuizById = (id_quiz) => {
    const foundQuizById = quiz.filter((quiz) => quiz.id === id_quiz)[0];
    if (foundQuizById) {
      return {
        title: foundQuizById.title,
        description: foundQuizById.description,
      };
    }
    return {
      title: "undefined",
      description: "undefined",
    };
  };

  const colorScoreParameter = (score) => {
    if (score >= 80 && score <= 100) {
      return "bg-green-600";
    } else if (score >= 50 && score <= 79) {
      return "bg-yellow-500";
    } else if (score >= 0 && score <= 49) {
      return "bg-red-600";
    }
  };

  useEffect(() => {
    axios
      .get(`https://616981a909e030001712c409.mockapi.io/users/${id}`)
      .then((response) => {
        setUsers(response.data.history);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  useEffect(() => {
    axios
      .get("https://616981a909e030001712c409.mockapi.io/quiz/")
      .then((response) => {
        setQuiz(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex overflow-hidden flex-col paragraph px-4 grow">
        <h1 className="text-2xl font-bold px-9 pt-9 border-b-1">
          History Score
        </h1>
        <div className="p-9 flex flex-col">
          {!users ? (
            <svg
              role="status"
              className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          ) : (
            <>
              {users.map((data, index) => (
                <div
                  key={index}
                  className="flex flex-row bg-white drop-shadow-md w-full rounded-lg mb-6"
                >
                  <img
                    className="basis-1/4 rounded-lg h-40 p-1"
                    src="https://cdn.dribbble.com/users/2304135/screenshots/10819001/media/ed0b3877ec4d171bdff22367f27f2792.png?compress=1&resize=1200x900&vertical=top"
                    alt=""
                  />
                  <div className="basis-1/2 p-5">
                    <h5 className="mb-2 text-md font-bold tracking-tight text-gray-900">
                      {getDataQuizById(data.id_quiz).title}
                    </h5>
                    <p className="mb-3 text-xs text-gray-700">
                      {getDataQuizById(data.id_quiz).description}
                    </p>
                  </div>
                  <div
                    className={`basis-1/4 ${colorScoreParameter(
                      data.score
                    )} h-full flex justify-center items-center rounded-r-lg`}
                  >
                    <div className="text-2xl font-bold text-white">
                      {data.score}
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
