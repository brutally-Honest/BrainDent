import { useState, useContext, Fragment } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { useFormik } from "formik";
import axios from "../../config/axios";

export const StartQuiz = () => {
  const { id } = useParams();
  const navigate=useNavigate()
  const { userState,userDispatch } = useContext(UserContext);
  const quiz = userState.quizzes.find((e) => e._id === id);
  const [current, setCurrent] = useState(0);

  const changeQuestion = (page) => {
    if (page >= 0 && page < quiz.questions.length) setCurrent(page);
  };
  const formik = useFormik({
    initialValues: {
      singleChoice: [],
      multipleChoice: {},
    },
    validateOnChange: false,
    onSubmit: async (formData) => {
      try {
       
        const result = [...Array(quiz.questions.length)].map((e, i) => {
          if (i in formData.multipleChoice) {
            return [...formData.multipleChoice[i]];
          }
          if (formData.singleChoice[i]) {
            return formData.singleChoice[i];
          }
        });
        console.log(result);
        const { data } = await axios.post(
          `/api/quiz-response/${quiz._id}`,
          { answers: result },
          {
            headers: { Authorization: localStorage.getItem("token") },
          }
        );
        alert(data.msg)
        userDispatch({type:"ATTEMPT_QUIZ",payload:data.data})
        navigate('/attemptedQuizzes')
      } catch (e) {
        // console.log(e);
        alert(e.response.data);
        navigate('/attemptedQuizzes')
      }
    },
  });

  const handleCheckSingle = (optionId) => {
    const filter = formik.values.singleChoice;
    filter[current] = optionId;
    formik.setFieldValue("singleChoice", filter);
  };
  const handleCheckMultiple = (optionId) => {
    if (current in formik.values.multipleChoice) {
      if (formik.values.multipleChoice[current].includes(optionId)) {
        const filter = formik.values.multipleChoice[current].filter(
          (e) => e !== optionId
        );
        formik.setFieldValue("multipleChoice", {
          ...formik.values.multipleChoice,
          [current]: filter,
        });
      } else {
        formik.setFieldValue("multipleChoice", {
          ...formik.values.multipleChoice,
          [current]: [...formik.values.multipleChoice[current], optionId],
        });
      }
    } else {
      formik.setFieldValue("multipleChoice", {
        ...formik.values.multipleChoice,
        [current]: [optionId],
      });
    }
  };
  return (
    <div>
      <h2>{quiz?.title}</h2>
      <form onSubmit={formik.handleSubmit}>
        {quiz?.questions.map((e, i, arr) => {
          return current === i ? (
            <Fragment key={e._id}>
              <h3>{e.questionId.title}</h3>
              <h4 className="badge">
                {e.questionId.type === "scq"
                  ? "Single Choice Question"
                  : "Multiple Choice Question"}
              </h4>
              {e.questionId.options.map((option) => (
                <label
                  key={option._id}
                  style={{ display: "flex", width: "fit" }}
                >
                  <div>
                    {e.questionId.type === "scq" && (
                      <input
                        type="radio"
                        name={`singleChoice[${formik.values.singleChoice.length}]`}
                        checked={
                          formik.values.singleChoice[current] === option._id
                        }
                        onChange={() => handleCheckSingle(option._id)}
                      />
                    )}
                    {e.questionId.type === "mcq" && (
                      <input
                        type="checkbox"
                        checked={
                          current in formik.values.multipleChoice &&
                          formik.values.multipleChoice[current].includes(
                            option._id
                          )
                        }
                        onChange={() => handleCheckMultiple(option._id)}
                      />
                    )}
                  </div>
                  <div>{option.optionText}</div>
                </label>
              ))}
              <div style={{ display: "flex" }}>
                <div>
                  <button
                    type="button"
                    disabled={current === 0}
                    onClick={() => changeQuestion(i - 1)}
                  >
                    Previous
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    disabled={current === quiz.questions.length - 1}
                    onClick={() => changeQuestion(i + 1)}
                  >
                    Next
                  </button>
                </div>
              </div>
              <div>
                <input type="submit" value={"Submit"} />
              </div>
            </Fragment>
          ) : (
            ""
          );
        })}
      </form>
    </div>
  );
};
