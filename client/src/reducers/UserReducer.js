export const UserReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN": {
      if (action.payload.role === "admin")
        return {
          ...state,
          user: action.payload,
          questions: [],
          editQuestionId: "",
          editQuizId: "",
        };
      else return { ...state, user: action.payload, attemptedQuizzes: [] };
    }
    case "LOGOUT":
      return { user: {}, quizzes: {} };
    case "SET_QUIZZES": {
      return { ...state, quizzes: action.payload };
    }
    case "ADD_QUIZ": {
      return { ...state, quizzes: [...state.quizzes, action.payload] };
    }
    case "DELETE_QUIZ": {
      return {
        ...state,
        quizzes: state.quizzes.filter((e) => e._id !== action.payload),
      };
    }
    case "SET_EDIT_QUIZ_ID": {
      return { ...state, editQuizId: action.payload };
    }
    case "CLEAR_EDIT_QUIZ_ID": {
      return { ...state, editQuizId: action.payload };
    }
    case "EDIT_QUIZ": {
      return {
        ...state,
        quizzes: state.quizzes.map((e) => {
          if (e._id === action.payload._id) return { ...action.payload };
          else return { ...e };
        }),
        editQuizId: "",
      };
    }
    case "SET_QUESTIONS": {
      return { ...state, questions: action.payload };
    }
    case "ADD_QUESTION": {
      return { ...state, questions: [ action.payload,...state.questions] };
    }
    case "SET_EDIT_QUESTION_ID": {
      return { ...state, editQuestionId: action.payload };
    }
    case "CLEAR_EDIT_QUESTION_ID": {
      return { ...state, editQuestionId: "" };
    }
    case "EDIT_QUESTION": {
      return {
        ...state,
        editQuestionId: "",
        questions: state.questions.map((e) => {
          if (e._id === action.payload._id) return { ...action.payload };
          else return { ...e };
        }),
      };
    }
    case "SET_ATTEMPTED_QUIZZES": {
      return { ...state, attemptedQuizzes: action.payload };
    }
    case "ATTEMPT_QUIZ": {
      if (
        state.attemptedQuizzes.find(
          (e) => e.quiz._id === action.payload.quiz._id
        )
      )
        return {
          ...state,
          attemptedQuizzes: state.attemptedQuizzes.map((e) => {
            if (e.quiz._id === action.payload.quiz._id)
              return { ...action.payload };
            else return { ...e };
          }),
        };
      else {
        return {...state,attemptedQuizzes:[...state.attemptedQuizzes,action.payload]}
      }
    }
    default:
      return { ...state };
  }
};
