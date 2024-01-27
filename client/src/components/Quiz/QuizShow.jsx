import { useContext } from "react";
import {  useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

export const QuizShow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userState } = useContext(UserContext);
  const quiz = userState.quizzes.find((e) => e._id == id);
console.log(quiz);
  return (
    <div>
      {quiz && (
        <>
          <h2>{quiz.title}</h2>
          <div>
            {quiz.questions?.map((e, i) => (
              <div key={e._id}>
                <strong>
                  <span className="p5">{i + 1}]</span>
                  {e.questionId?.title}
                </strong>
                {userState.user.role === "admin" && (
                  <div>
                    {e.questionId?.options?.map((ele) => (
                      <li key={ele._id}>
                        {ele.optionText}
                        <strong style={{ color: "green" }}>
                          {ele.isCorrect ? "- Correct Answer" : ""}
                        </strong>
                      </li>
                    ))}
                    {(i!==quiz.questions.length-1)&&<hr></hr>}
                  </div>
                )}
              </div>
            ))}
            {userState.user.role === "user" && (
              <>
                <button
                  disabled={
                    userState.attemptedQuizzes.find(
                      (e) => e.quiz._id == quiz._id
                    )
                      ? userState.attemptedQuizzes.find(
                          (e) => e.quiz._id == quiz._id
                        ).attempts === 3
                        ? true
                        : false
                      : false
                  }
                  onClick={() => navigate(`/quiz-started/${id}`)}
                >
                  Start Quiz
                </button>
                <div className="badge p10 m10">
                  Attempts -
                  {userState.attemptedQuizzes.find(
                    (e) => e.quiz._id == quiz._id
                  )
                    ? userState.attemptedQuizzes.find(
                        (e) => e.quiz._id == quiz._id
                      ).attempts
                    : 0}
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};
