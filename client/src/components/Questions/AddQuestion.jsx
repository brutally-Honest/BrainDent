import { useFormik } from "formik";
import { useContext, useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import axios from "../../config/axios";
import { UserContext } from "../../context/UserContext";
import * as Yup from "yup";

export const AddQuestion = () => {
  const [totalTags, setTotalTags] = useState([]);
  const [serverErrors, setServerErrors] = useState([]);
  const { userDispatch ,userState} = useContext(UserContext);
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get("/api/tags", {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });
        const tags = data.map((e) => ({ value: e._id, label: e.name }));
        setTotalTags(tags);
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  useEffect(()=>{
    if(userState.editQuestionId){
        const questionToBeEdited=userState.questions.find(e=>e._id===userState.editQuestionId)
        const formattedTags=questionToBeEdited.tags.map(e=>totalTags.find(ele=>ele.value===e.tagId))
        formik.setFieldValue('title',questionToBeEdited.title)
        formik.setFieldValue('type',questionToBeEdited.type)
        formik.setFieldValue('options',questionToBeEdited.options)
        formik.setFieldValue('tags',formattedTags)
    }
    else formik.resetForm()
  },[userState.editQuestionId])

  const questionValidationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required *").min(10),
    options: Yup.array().of(
      Yup.object().shape({
        optionText: Yup.string().required("Option must not be empty *"),
      })
    ),
  });
  const formik = useFormik({
    initialValues: {
      title: "",
      type: "scq",
      options: [
        { optionText: "", isCorrect: false },
        { optionText: "", isCorrect: false },
      ],
      tags: [],
    },
    validateOnChange: false,
    validationSchema: questionValidationSchema,
    onSubmit: async (formData,{resetForm}) => {
      formData.tags=formData.tags.map(e=>({tagId:e.value}))
      // console.log(formData);

      try {
        if(userState.editQuestionId){
          const { data } = await axios.put(`/api/questions/${userState.editQuestionId}`, formData, {
            headers: { Authorization: localStorage.getItem("token") },
          });
          resetForm()
          userDispatch({ type: "EDIT_QUESTION", payload: data });
        }else {
          const { data } = await axios.post(`/api/questions`, formData, {
            headers: { Authorization: localStorage.getItem("token") },
          });
          resetForm()
          userDispatch({ type: "ADD_QUESTION", payload: data });
        }
        setServerErrors([])
      } catch (e) {
        console.log(e);
        setServerErrors(e.response.data.errors);
      }
    },
  });
  const handleCorrectAnswer = (index) => {
    if (formik.values.type === "scq") {
      const single = formik.values.options.map((e, i) => {
        if (i === index) return { ...e, isCorrect: true };
        else return { ...e, isCorrect: false };
      });
      formik.setFieldValue("options", single);
    } else if (formik.values.type === "mcq") {
      const multiple = formik.values.options.map((e, i) => {
        if (i === index) return { ...e, isCorrect: !e.isCorrect };
        else return { ...e };
      });
      formik.setFieldValue("options", multiple);
    }
  };
  const handleTypeChange = (type) => {
    const optionsCorrectAnswerFlushed = formik.values.options.map((e) => ({
      ...e,
      isCorrect: false,
    }));
    formik.setFieldValue("options", optionsCorrectAnswerFlushed);
    formik.setFieldValue("type", type);
  };
  const addOption = () => {
    const options = [
      ...formik.values.options,
      { optionText: "", isCorrect: false },
    ];
    formik.setFieldValue("options", options);
  };
  const removeOption = (index) => {
    const options = formik.values.options.filter((e, i) => i !== index);
    formik.setFieldValue("options", options);
  };
  const createNewTag = async (e) => {
    let newTag = e.find((element) => element.__isNew__ === true);
    if (newTag) {
      delete newTag.__isNew__;
      try {
        const { data } = await axios.post(
          "/api/tags",
          { name: newTag.value },
          { headers: { Authorization: localStorage.getItem("token") } }
        );
        newTag.value = data._id;
        newTag.label = data.name;
        setTotalTags([...totalTags, newTag]);
        formik.setFieldValue("tags", [...formik.values.tags, newTag]);
      } catch (err) {
        console.log(err);
      }
    } else {
      formik.setFieldValue("tags", e);
    }
  };
  return (
    <div>
      <strong>Add Question</strong>
      <form onSubmit={formik.handleSubmit} className="qForm">
        <div  className="p5">
          <div>Title</div>
          <input
            type="text"
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
          />
          <div className="inputErrors">{formik.errors.title}</div>
        </div>
        <div className="p5" >
          <div>Type</div>
          <label>
            Single Choice Question
            <input
              type="radio"
              name="type"
              id="scq"
              checked={formik.values.type === "scq" ? true : false}
              value={formik.values.type}
              onChange={(e) => handleTypeChange(e.target.id)}
            />
          </label>
          <label>
            Multiple Choice Question
            <input
              type="radio"
              name="type"
              id="mcq"
              checked={formik.values.type === "mcq" ? true : false}
              value={formik.values.type}
              onChange={(e) => handleTypeChange(e.target.id)}
            />
          </label>
        </div>
        <div className="p5">
          Options
          {formik.values.options.map((option, i) => (
            <div key={i} className="df">
              <div style={{ display: "flex" }}>
                <div>
                  {formik.values.type === "scq" && (
                    <input
                      type="radio"
                      name="scqCorrectAnswer"
                      checked={option.isCorrect}
                      onChange={() => handleCorrectAnswer(i)}
                    />
                  )}
                  {formik.values.type === "mcq" && (
                    <input
                      type="checkbox"
                      checked={option.isCorrect}
                      onChange={() => handleCorrectAnswer(i)}
                    />
                  )}

                  <input
                    type="text"
                    name={`options[${i}].optionText`}
                    value={`${formik.values.options[i].optionText}`}
                    onChange={formik.handleChange}
                  />
                </div>
                <div>
                  {i > 1 && (
                    <button type="button" onClick={() => removeOption(i)}>
                      X
                    </button>
                  )}
                </div>
              </div>
              <div className="inputErrors">
                {formik.errors.options?.map(
                  (e, index) => i === index && e.optionText
                )}
              </div>
            </div>
          ))}
          <div className="inputErrors">{serverErrors.map((e) => e.msg)}</div>
          <div>
            <button onClick={addOption} type="button">
              Add Option
            </button>
          </div>
        </div>
        <div className="p5">
          Tags
          <CreatableSelect
            className="reactSelect"
            isMulti
            onChange={createNewTag}
            value={formik.values.tags}
            options={totalTags}
          />
        </div>
        <div className="p5">
          <input type="submit" value={userState.editQuestionId?"Update Question":"Add Question"} />
        </div>
      </form>
    </div>
  );
};
