import { NextFunction, Request, Response } from "express";
import { DatabaseManager } from "../utils/db"

const manager = new DatabaseManager("log_hopper_db", "","root", "localhost")

export function authCheck(req : Request, res : Response, next : NextFunction) {
    //TODO: Token checker code
    console.log("hello from auth check")
    next()
}


export async function getUsers(req : Request, res : Response) {
    const response = await manager.executeQuery("SELECT userid, userName FROM `users`", [])
    if (response.length == 0){
        res.sendStatus(500)
        return   
    }
    res.status(200).send(response)
    return
}

export async function getUsersById(req : Request, res : Response) {
    const id = req.params.id
    const response = await manager.executeQuery("SELECT userName, email FROM USERS WHERE UserID = ?", [id])
    if (response.length == 0){
        res.sendStatus(404)
        return   
    }
    res.status(200).send(response)
    return
    
}


export function postUsers(req : Request, res : Response) {
    const reqBod = req.body
    if (!reqBod.userName || !reqBod.email || !reqBod.password || !reqBod.rolePower) {
        res.status(400).json({"Error" : "missing argument"})
    } 
    manager.executeQuery("INSERT INTO USERS (userName, email, password, rolepower) VALUES (?, ?, ?, ?)" , [reqBod.userName, reqBod.email, reqBod.password])
    /* 
        #swagger.tags = ['auth/users']

        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Add new user. Note Data is not increpted before sending the password value needs to be a SHA256 of the password',
            schema: {
                $userName: 'John Doe',
                $email: 'john@doe.com',
                $password: 'Password',
                rolePower: 999
            }
        } */
    
}

export async function putUsers(req : Request, res : Response) {
    const userId = req.params.id; // Get UserID from the request parameters
    const reqBody = req.body;

    // Validate required fields
    if (!reqBody.userName && !reqBody.email && !reqBody.password && !reqBody.rolePower) {
        res.status(400).json({ "Error": "At least one field must be provided for update." });
        return
    }

    try {
        // First, retrieve the existing user by UserID
        const existingUserQuery = "SELECT * FROM USERS WHERE UserID = ?";
        const existingUser  = await manager.executeQuery(existingUserQuery, [userId]);

        if (existingUser.length === 0) { 
            res.status(404).json({ "Error": "User  not found." });
            return
        }
        // TODO: write the insert manager
        console.log("Insert Here")
        res.sendStatus(200)
    } catch (error) {
        console.error(error);
        res.status(500).json({ "Error": "An error occurred while updating the user." });
        return
    }
}

export function deleteUsers(req : Request, res : Response) {

}