import axios from "../../config/axios";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";

export const SingleQuestion = ({ question }) => {
  const { userState, userDispatch } = useContext(UserContext);

  const editQuestion = () => {
    userDispatch({ type: "SET_EDIT_QUESTION_ID", payload: question._id });
  };
  const cancelEdit=()=>{
    userDispatch({ type: "CLEAR_EDIT_QUESTION_ID"});
  }
  const delteQuestion = async () => {
    try {
      const { data } = await axios.delete(`/api/questions/${question._id}`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      const filter = userState.questions.filter((e) => e._id !== data._id);
      userDispatch({ type: "SET_QUESTIONS", payload: filter });
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div >
      <strong>{question.title}</strong>
      {userState.editQuestionId===question._id? (
        <button onClick={cancelEdit}>Cancel</button>
      ) : (
        <>
          <button onClick={editQuestion}>Edit</button>
          <button onClick={delteQuestion}>Delete</button>
        </>
      )}
    </div>
  );
};
