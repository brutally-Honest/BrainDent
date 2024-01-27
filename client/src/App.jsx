import axios from "./config/axios";
import { useEffect, useReducer, useState } from "react";
import { UserReducer } from "./reducers/UserReducer";
import { UserContext } from "./context/UserContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { Dashboard } from "./components/Dashboard";
import { jwtDecode } from "jwt-decode";
import { Questions } from "./components/Questions/Questions";
import { Quizzes } from "./components/Quiz/Quizzes";
import { AddQuiz } from "./components/Quiz/AddQuiz";
import { QuizShow } from "./components/Quiz/QuizShow";
import { StartQuiz } from "./components/Quiz/StartQuiz";
import { QuizResult } from "./components/Quiz/QuizResults";

function App() {
  const [userState, userDispatch] = useReducer(UserReducer, {
    user: {},
    quizzes: [],
  });

  useEffect(() => {
    console.log("app");
    if (localStorage.getItem("token")) {
      (async () => {
        try {
          const { role } = jwtDecode(localStorage.getItem("token"));
          if (role === "admin") {
            const responses = await Promise.allSettled([
              await axios.get("/api/users/account", {
                headers: { Authorization: localStorage.getItem("token") },
              }),
              await axios.get("/api/questions",{
                headers: { Authorization: localStorage.getItem("token") },
              }),
              await axios.get(`/api/quizzes`,{
                headers: { Authorization: localStorage.getItem("token") },
              }),
            ]);
            userDispatch({ type: "LOGIN", payload: responses[0].value.data });
            userDispatch({
              type: "SET_QUESTIONS",
              payload: responses[1].value.data,
            });
            userDispatch({
              type: "SET_QUIZZES",
              payload: responses[2].value.data,
            });
          } else {
            const responses = await Promise.allSettled([
              await axios.get("/api/users/account", {
                headers: { Authorization: localStorage.getItem("token") },
              }),
              await axios.get(`/api/quizzes`,{
                headers: { Authorization: localStorage.getItem("token") },
              }),
              await axios.get(`/api/quiz-response`, {
                headers: { Authorization: localStorage.getItem("token") },
              }),
            ]);
            console.log(responses);
            userDispatch({ type: "LOGIN", payload: responses[0].value.data });
            userDispatch({
              type: "SET_QUIZZES",
              payload: responses[1].value.data,
            });
            userDispatch({
              type: "SET_ATTEMPTED_QUIZZES",
              payload: responses[2].value.data,
            });
          }
        } catch (e) {
          console.log(e);
        }
      })();
    }
  }, []);
  return (
    <UserContext.Provider value={{ userState, userDispatch }}>
      <BrowserRouter>
        <h1>Brain Dent</h1>
        <Navbar />
        <Routes>
          <Route>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/questions" element={<Questions />} />
            <Route path="/quizzes" element={<Quizzes />} />
            <Route path="/quizzes/new" element={<AddQuiz />} />
            <Route path="/edit-quiz/:id" element={<AddQuiz />} />
            <Route path="/quizzes/:id" element={<QuizShow />} />
            <Route path="/quiz-started/:id" element={<StartQuiz />} />
            <Route path="/attemptedQuizzes" element={<QuizResult />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
