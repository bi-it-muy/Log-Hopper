import express, { NextFunction, Request, Response, json } from 'express'
import  cors  from 'cors'
import swaggerUi from "swagger-ui-express"
import SwaggerDocument from "./api-doc/swagger-output.json"
import { deleteUsers, getUsers, postUsers, putUsers, getUsersById } from './routes/users';
import { login, logout, reset, authStatus, authCheck } from './routes/auth';
import configObj from './utils/config';
import { postMetrics, upload } from './routes/metrics';
import session from "express-session";
import fileUpload, {UploadedFile} from "express-fileupload"


const config = configObj()
const app = express()
const PORT = config.port
app.use(express.json())
app.use(session({
    secret: "your_session_secret", // Use process.env.SECRET in prod
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // true if using HTTPS
}));
app.use(fileUpload())

//Routers
const apiRouter = express.Router();
const authRouter = express.Router();



authRouter.use("/api", apiRouter)
authRouter.use(cors())
apiRouter.use(authCheck)

app.use("/auth", authRouter)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(SwaggerDocument));



//apiRouter

// Users
apiRouter.get("/users", getUsers)
apiRouter.get("/users/:id", getUsersById)
apiRouter.post("/users", postUsers)


apiRouter.put("/users/:id", putUsers)

apiRouter.delete("/users/:id", deleteUsers)


//Metrics
// apiRouter.post("/metrics", postMetrics)

// apiRouter.post("/metrics/upload", upload)

// apiRouter.post("/metrics/settings")

// apiRouter.put("/metrics/settings")

// apiRouter.get("/metrics/settings")

// apiRouter.delete("/metrics/settings")



//authRouter
authRouter.post("/login", login)

authRouter.post("/logout", logout)

authRouter.post("/reset", reset)

authRouter.get("/status", authStatus)





app.listen(PORT, ()=> {
    console.log(`listening on Port: ${PORT}`)
})