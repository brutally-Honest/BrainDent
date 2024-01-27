import { useContext } from "react";
import { SingleQuestion } from "./SingleQuestion";
import { UserContext } from "../../context/UserContext";
import { AddQuestion } from "./AddQuestion";

export const Questions = () => {
  const { userState } = useContext(UserContext);
  return (
    <div className="qContainer">
        <div className="m50">
        <AddQuestion/>
        </div>
      <div >
      {userState.questions?.length>0 ?
        <div >
            Listing Questions - <strong>{userState.questions.length}</strong>
          <div className="scrollY">
          {userState.questions.map((e) => (
          <SingleQuestion key={e._id} question={e} />
        ))}
          </div>
        </div>:<div className="m10">
            No Questions Yet! 
            </div>}
      </div>
    </div>
  );
};
