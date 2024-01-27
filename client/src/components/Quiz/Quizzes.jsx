import { Link } from "react-router-dom"
import { ListingQuizzes } from "./ListingQuizzes"
import { useContext } from "react"
import { UserContext } from "../../context/UserContext"

export const Quizzes=()=>{
    const {userState}=useContext(UserContext)
    return <div >
        <div  >
            <ListingQuizzes/>
        </div>
        {userState.user.role==="admin"&&<div >
           <Link to={'/quizzes/new'}>Add Quiz</Link>
        </div>}
    </div>
}