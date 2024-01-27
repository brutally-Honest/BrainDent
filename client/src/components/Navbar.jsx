import _ from "lodash";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

export const Navbar = () => {
  const { userState, userDispatch } = useContext(UserContext);
  const Logout = () => {
    localStorage.removeItem("token");
    userDispatch({ type: "LOGOUT" });
  };
  return (
    <div>
      {_.isEmpty(userState.user) ? (
        <div >
         <div> <Link to={"/login"}>Login</Link></div>
          <div><Link to={"/register"}>Register</Link></div>
        </div>
      ) : (
        <div>
          {userState.user.role === "admin" ? (
            <div>
              <Link to={"/questions"}>Questions</Link>
            </div>
          ) : (
            <div>
              <Link to={"/attemptedQuizzes"}>Attempted Quizzes</Link>
            </div>
          )}
          <div><Link to={"/quizzes"}>Quizzes</Link></div>
          <div><Link to={"/login"} onClick={Logout}>
            Logout
          </Link></div>
        </div>
      )}
    </div>
  );
};
