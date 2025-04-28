import express, { NextFunction, Request, Response } from 'express'
import { deleteUsers, getUsers, postUsers, putUsers } from './handlers/users';

const app = express()
const PORT = 3000


const apiRouter = express.Router();

apiRouter.get("/users", getUsers)

apiRouter.post("/users", postUsers)

apiRouter.put("/users", putUsers)

apiRouter.delete("/users", deleteUsers)



app.use("/api", apiRouter)

app.listen(PORT, ()=> {
    console.log(`listening on Port: ${PORT}`)
})