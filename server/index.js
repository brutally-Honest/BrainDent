require("dotenv").config()
const express=require("express")
const {checkSchema}=require("express-validator")
const cors=require("cors")
const app=express()
const port=process.env.PORT || 3000
const configureDB=require("./config/db")
app.use(cors())
app.use(express.json())

const { authenticateUser,authorizeUser } = require("./app/middlewares/authenticateUser")
const {userRegisterSchema,userLoginSchema}=require("./app/helpers/userValidationSchema")

const usersCltr=require("./app/controllers/usersCltr")
const tagsCltr=require("./app/controllers/tagsCltr")
const questionsCltr=require("./app/controllers/questionsCltr")
const quizzesCltr=require("./app/controllers/quizzesCltr")

const tagValidationSchema=require("./app/helpers/tagValidationSchema")
const questionValidationSchema = require("./app/helpers/questionValidationSchema")
const quizValidationSchema=require('./app/helpers/quizValidationSchema')
const responsesCltr = require("./app/controllers/responsesCltr")

configureDB()

app.post("/api/users/register",checkSchema(userRegisterSchema),usersCltr.register)
app.post("/api/users/login",checkSchema(userLoginSchema),usersCltr.login)
app.get("/api/users/account",authenticateUser,usersCltr.account)

app.post("/api/tags",authenticateUser,authorizeUser,checkSchema(tagValidationSchema),tagsCltr.create)
app.get("/api/tags",authenticateUser,tagsCltr.list)

app.get("/api/questions",authenticateUser,authorizeUser,questionsCltr.list)
app.get("/api/questions/:id",authenticateUser,questionsCltr.show)
app.post("/api/questions",authenticateUser,authorizeUser,checkSchema(questionValidationSchema),questionsCltr.create)
app.delete("/api/questions/:id",authenticateUser,authorizeUser,questionsCltr.delete)
app.put("/api/questions/:id",authenticateUser,authorizeUser,checkSchema(questionValidationSchema),questionsCltr.edit)

app.get('/api/quizzes',authenticateUser,quizzesCltr.list)
app.post('/api/quizzes',authenticateUser,authorizeUser,checkSchema(quizValidationSchema),quizzesCltr.create)
app.put('/api/quizzes/:id',authenticateUser,authorizeUser,checkSchema(quizValidationSchema),quizzesCltr.edit)
app.delete('/api/quizzes/:id',authenticateUser,authorizeUser,quizzesCltr.delete)


app.post('/api/quiz-response/:id',authenticateUser,responsesCltr.calculate)
app.get('/api/quiz-response',authenticateUser,responsesCltr.all)

app.listen(port,()=>{console.log("server running on",port)})