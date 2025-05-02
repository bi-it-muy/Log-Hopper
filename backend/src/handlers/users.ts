import { NextFunction, Request, Response } from "express";
import { DatabaseManager } from "../utils/db"

const manager = new DatabaseManager("log_hopper_db", "","root", "localhost")

export function authCheck(req : Request, res : Response, next : NextFunction) {
    //TODO: Token checker code
    console.log("hello from auth check")
    next()
}

export async function getUsers(req : Request, res : Response) {
    const response = await manager.executeQuery("SELECT userName, email FROM `users`", [])
    res.status(200).send(response)
}

export function postUsers(req : Request, res : Response) {
    
}

export function putUsers(req : Request, res : Response) {
    
}

export function deleteUsers(req : Request, res : Response) {
    
}