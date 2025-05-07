import { NextFunction, Request, Response } from "express";
import { DatabaseManager } from "../utils/db";
import { sign, verify } from "jsonwebtoken";
import { createHash } from "crypto"






const SECRET_KEY = "your_jwt_secret"; // Store this in an env var for production
const manager = new DatabaseManager("log_hopper_db", "", "root", "localhost");


function hashPassword(password: string): string {

    return createHash('sha256').update(password).digest('hex');

}


export async function login(req: Request, res: Response, next: NextFunction) {

    let reqBod = req.body;

    let userObj = {

        password: reqBod?.password,

        userName: reqBod?.userName

    }


    if (!userObj.userName) {

        res.status(400).json({ "Error": "Username is required" });

        return;

    }

    if (!userObj.password) {

        res.status(400).json({ "Error": "Password is required" });

        return;

    }


    try {

        // Query to find the user by username

        const query = `SELECT * FROM users WHERE userName = ?`;

        const users = await manager.executeQuery(query, [userObj.userName]);
        console.log(users)

        if (users.length === 0) {

            res.status(401).json({ "Error": "Invalid username or password" });

            return; // Return after sending the response

        }


        const user = users[0]; // Get the first user from the result

        const hashedPassword = user.password;


        // Validate the password

        const isPasswordValid = hashPassword(reqBod.password) == hashedPassword;
        console.log(isPasswordValid)


        if (!isPasswordValid) {

            res.status(401).json({ error: "Invalid username or password" });

            return; // Return after sending the response

        }


        // Create JWT token

        const TokenPayload = {

            userId: user.UserID // Ensure this matches your database field

        };


        const token = sign(TokenPayload, SECRET_KEY, { expiresIn: '3h' });



        // Send response

        res.json({ message: "Login successful", user: { userName: user.userName, email: user.email }, token });

        return; // Return after sending the response

    } catch (error) {

        console.error("Error during login:", error);

        res.status(500).json({ "Error": "Internal Server Error" });

        return; // Return after sending the response

    }

}

//Get Function
export async function authStatus(req: Request, res: Response) {

    // TODO: Dont! Assume token is sent in Authorization header as: Bearer <token>

    const authHeader = req.headers.authorization;

    if (!authHeader) {

        res.status(401).json({ error: "Authorization header missing" });

        return;

    }


    const token = authHeader.split(' ')[1];

    if (!token) {

        res.status(401).json({ error: "Token missing" });

        return;

    }


    verify(token, SECRET_KEY, (err, decoded) => {

        if (err) {

            res.status(401).json({ error: "Invalid or expired token" });

            return;

        }


        // `decoded` is of type string or object, assert object here

        const decodedPayload = decoded as any;


        res.status(200).json({

            message: "Authentication valid",

            userId: decodedPayload.userId || decodedPayload.UserID,

            payload: decodedPayload

        });

    });

}

//Post Function
export function logout(req: Request, res: Response) {
    //1 TODO: Write logout Function
}
//Post Function
export function reset(req: Request, res: Response) {
    //1 TODO: Write a password Reset Function
}