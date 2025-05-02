import express, { NextFunction, Request, Response, json } from 'express'
import  cors  from 'cors'
import { deleteUsers, getUsers, postUsers, putUsers, authCheck } from './handlers/users';
import { login, logout, reset, authStatus } from './handlers/auth';
import configObj from './utils/config';


const config = configObj()
const app = express()
app.use(express.json())

const PORT = config.port



//Routers
const apiRouter = express.Router();
const authRouter = express.Router();

authRouter.use("/api", apiRouter)
authRouter.use(cors())
apiRouter.use(authCheck)



//apiRouter
apiRouter.get("/users", getUsers)

apiRouter.post("/users", postUsers)

apiRouter.put("/users", putUsers)

apiRouter.delete("/users", deleteUsers)

apiRouter.use(authCheck)

//authRouter
authRouter.post("/login", login)

authRouter.post("/logout", logout)

authRouter.post("/reset", reset)

authRouter.get("/status", authStatus)



app.use("/auth", authRouter)

app.listen(PORT, ()=> {
    console.log(`listening on Port: ${PORT}`)
})