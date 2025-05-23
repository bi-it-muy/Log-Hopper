import { NextFunction, Request, Response } from "express";
import { DatabaseManager } from "../utils/db";
import { sign, verify } from "jsonwebtoken";
import { createHash } from "crypto"



const SECRET_KEY = "your_jwt_secret"; // Store this in an env var for production
const manager = new DatabaseManager("log_hopper_db", "", "root", "localhost");

export async function authCheck(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ error: "Token missing" }); // Deny access if token is missing
        return;
    }

    try {
        const decoded = verify(token, SECRET_KEY) as { userId: string };

        if (!decoded.userId) {
            res.status(403).json({ error: "Malformed token" }); // Deny access if token is malformed
            return;
        }

        // Check if the token exists in the database for the user
        const check = await manager.executeQuery(
            'SELECT 1 FROM TOKENS WHERE UserID = ? AND TokenValue = ? LIMIT 1',
            [decoded.userId, token]
        );

        if (check[0].length === 0) {
            res.status(403).json({ error: "Token not found in database" }); // Deny access if token is not in the database
            return;
        }

        // Token is valid and exists in the database
        next();
    } catch (err) {
        console.error('Error verifying token:', err);
        res.status(403).json({ error: "Invalid or expired token" }); // Deny access if token verification fails
        return;
    }
}


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
        const query = `SELECT * FROM users WHERE userName = ?`;
        const users = await manager.executeQuery(query, [userObj.userName]);
        console.log(users)

        if (users.length === 0) {
            res.status(401).json({ "Error": "Invalid username or password" });
            return;

        }

        const user = users[0];
        const hashedPassword = user.password;

        const isPasswordValid = hashPassword(reqBod.password) == hashedPassword;
        console.log(isPasswordValid)

        if (!isPasswordValid) {
            res.status(401).json({ error: "Invalid username or password" });
            return; // Return after sending the response

        }

        // Generate JWT token


        const TokenPayload = {
            userId: user.UserID 
        };

        const token = sign(TokenPayload, SECRET_KEY, { expiresIn: '1h' });
        console.log(token)

        // Send response
        manager.executeQuery('INSERT INTO TOKENS (UserID, TokenValue) VALUES (?, ?)', [user.UserID, token]);

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
            message: "Valid Token"
        });

    });

}

//Post Function
export async function logout(req: Request, res: Response) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    try {
        if (!token) {
            res.status(401).json({ error: "Token missing" });
            return;
        }

        const decoded = verify(token, SECRET_KEY) as { userId: string };
        const userId = decoded.userId;

        const result = await manager.executeQuery('DELETE FROM TOKENS WHERE UserID = ? AND TokenValue = ?', [userId, token]);
        res.status(200).json({ msg: "Logged out successfully" });

    } catch (err) {
        console.error("Logout error:", err);
        res.status(401).json({ error: "Invalid token or logout failed" });
    }
}

//Post Function
export function reset(req: Request, res: Response) {
    //1 TODO: Write a password Reset Function
}