import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { Link } from "react-router-dom";
import axios from "../../config/axios";

export const ListingQuizzes = () => {
  const { userState, userDispatch } = useContext(UserContext);
  const editQuiz = (quizId) => {
    userDispatch({ type: "SET_EDIT_QUIZ_ID", payload: quizId });
  };
  const deleteQuiz = async (quizId) => {
    try {
      const { data } = await axios.delete(`/api/quizzes/${quizId}`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      userDispatch({ type: "DELETE_QUIZ", payload: data._id });
    } catch (e) {
      console.log(e.response);
    }
  };
  return (
    <div className="p10">
        <h3>Total Quizzes - {userState.quizzes?.length}</h3>
      {userState.quizzes?.map((e) => (
        <div key={e._id} className=" border">
          <div className="quizList">
           <div> <Link to={`/quizzes/${e._id}`}>{e.title}</Link></div>
            {userState.user.role === "admin" && (
              <div>
                <button>
                  <Link
                    to={`/edit-quiz/${e._id}`}
                    onClick={() => editQuiz(e._id)}
                  >
                    Edit
                  </Link>
                </button>
                <button onClick={() => deleteQuiz(e._id)}>Delete</button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
