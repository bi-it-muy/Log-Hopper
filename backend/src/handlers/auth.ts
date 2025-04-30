import { NextFunction, Request, Response } from "express";
import { DatabaseManager } from "../utils/db";
//import CryptoJS from "crypto-js";

const manager = new DatabaseManager("log_hopper_db", "", "root", "localhost");

export async function login(req: Request, res: Response, next : NextFunction) {
    let reqBod = req.body;
    let userObj = {
        password: reqBod?.password || reqBod?.Password,
        userName: reqBod?.userName || reqBod?.UserName
    }


    // Validate input
    if (!userObj.userName) {
        res.json({ "Error" :"Username is required" });
        return
    }
    if (!userObj.password) {
        res.json({ "Error" : "Password is required" });
        return
    }

    try {
        // Query to find the user by username or email
        const query = `SELECT * FROM users WHERE userName = "${userObj.userName}";`;
        const users = await manager.executeQuery(query);

        if (users.length == 0) {
            res.json({ "Error": "Invalid username or password" });
            return
        }

        const user = await users[0];

        // // Verify the password TODO: write a hash function for the forntend
        // const hashedPassword = user.password; // Assuming the stored password is hashed
        // const isPasswordValid = CryptoJS.SHA256(userObj.password).toString() === hashedPassword;

        // if (!isPasswordValid) {
        //     res.json({ "Error": "Invalid username or password" });
        //     
        // }

        // Successful login TODO: Return/Genereate JWT Token
        res.json({ message: "Login successful", user: { userName: user.userName, email: user.email } });
        return
    } catch (error) {
        console.error("Error during login:", error);
        res.json({ "Error": "Internal Server Error" });
        return
    }
}
//Get Function
export function authStatus(req : Request, res : Response) {
    //TODO: Write login status tracker

    
}

//Post Function
export function logout(req : Request, res : Response) {
    //TODO: Write logout Function
}
//Post Function
export function reset(req : Request, res : Response) {
    //TODO: Write a password Reset Function
}