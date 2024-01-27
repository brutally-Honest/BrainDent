import { useContext, useEffect,useMemo } from "react";
import { UserContext } from "../../context/UserContext";
import axios from "../../config/axios";
import { Link } from "react-router-dom";

export const QuizResult = () => {
  const { userState, userDispatch } = useContext(UserContext); 
  return (
    <div>
      {userState.attemptedQuizzes?.length > 0 ? (
        <div className=" ">
          <h3>Attempted Quizzes - <strong>{userState.attemptedQuizzes?.length}</strong></h3>
          <div className=" p10">
            {userState.attemptedQuizzes.map((e) => (
                <div key={e._id} className="card">
              <Link  to={`/quizzes/${e.quiz?._id}`}>
                {e.quiz?.title}
              </Link>
              <div className="badge">Attempts - <strong >{e.attempts}</strong></div>
             <div>
             Your Score  <strong>{e?.score?.map((marks,i)=><li key={i}>{marks}/{e.quiz.questions.length}</li>)}</strong>
             </div>
                </div>
            ))}
          </div>
        </div>
      ) : (
        <div>No Quizzes Attempted Yet</div>
      )}
    </div>
  );
};
