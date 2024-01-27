import { useFormik } from "formik";
import { useContext, useEffect, useState } from "react";
import axios from "../../config/axios";
import * as Yup from "yup";
import { UserContext } from "../../context/UserContext";
import { Link, useNavigate } from "react-router-dom";

export const AddQuiz = () => {
  const navigate = useNavigate();
  console.log("gg");
  const { userState, userDispatch } = useContext(UserContext);
  const [search, setSearch] = useState("");
  const quizValidationSchema = Yup.object().shape({
    title: Yup.string().required("Quiz Title is required *"),
    questions: Yup.array().min(5, "Minimum 5 questions required *"),
  });
  useEffect(() => {
    if (userState.editQuizId) {
      const quiz = userState.quizzes.find((e) => e._id == userState.editQuizId);
      const questions = quiz.questions.map((e) => e.questionId._id);
      formik.setFieldValue("title", quiz?.title);
      formik.setFieldValue("questions", questions);
    }
  }, [userState.editQuizId]);

  useEffect(() => {
    return () => {
      userDispatch({ type: "CLEAR_EDIT_QUIZ_ID" });
    };
  }, []);
  const formik = useFormik({
    initialValues: {
      title: "",
      questions: [],
    },
    validateOnChange: false,
    validationSchema: quizValidationSchema,
    onSubmit: async (formData) => {
      formData.questions = formData.questions.map((e) => ({ questionId: e }));
      try {
        if (userState.editQuizId) {
          const { data } = await axios.put(
            `/api/quizzes/${userState.editQuizId}`,
            formData,
            {
              headers: {
                Authorization: localStorage.getItem("token"),
              },
            }
          );
          console.log(data);
          userDispatch({ type: "EDIT_QUIZ", payload: data });
          navigate(`/quizzes/${data._id}`);
        } else {
          const { data } = await axios.post("/api/quizzes", formData, {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          });
          console.log(data);
          userDispatch({ type: "ADD_QUIZ", payload: data });
          navigate(`/quizzes/${data._id}`);
        }
      } catch (e) {
        console.log(e);
      }
    },
  });

  const handleQuestionCheck = (questionId) => {
    if (formik.values.questions?.includes(questionId))
      formik.setFieldValue(
        "questions",
        formik.values.questions.filter((e) => e !== questionId)
      );
    else
      formik.setFieldValue("questions", [
        ...formik.values.questions,
        questionId,
      ]);
  };
  const cancel = () => {
    userDispatch({ type: "CLEAR_EDIT_QUIZ_ID" });
    navigate("/quizzes");
  };
  return (
    <div>
     {userState.questions?.length>0? <form onSubmit={formik.handleSubmit}>
        <div>
          <div>Quiz Name</div>
          <input
            type="text"
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
          />
          <div className="inputErrors">{formik.errors.title}</div>
        </div>
        <div className="m10">
          <input
            type="text"
            placeholder="Search by Tags"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

          Select Questions
          <div className="scrollY">
            {userState.questions
              ?.filter((e) =>
                e.tags.find((ele) =>
                  ele?.tagId?.name?.toLowerCase().includes(search.toLowerCase())
                )
              )
              .map((e) => (
                <div key={e._id}>
                  <label style={{ display: "flex" }}>
                    <div>
                      <input
                        type="checkbox"
                        checked={formik.values.questions.includes(e._id)}
                        onChange={() => handleQuestionCheck(e._id)}
                      />
                    </div>
                    <div>{e.title}</div>
                  </label>
                </div>
              ))}
          </div>
          <div className="inputErrors">{formik.errors.questions}</div>
          <div>
          <input
            type="submit"
            value={userState.editQuizId ? "Update Quiz" : "Add Quiz"}
          />
          {userState.editQuizId && (
            <button type="button" onClick={cancel}>
              Cancel
            </button>
          )}
        </div>       
      </form>:<div className="m10"><div>Add Questions first to create a Quiz</div>
      <Link to={'/questions'}>Create One Here!</Link>
      </div>}
    </div>
  );
};
