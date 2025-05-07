import { NextFunction, Request, Response } from "express";
import { DatabaseManager } from "../utils/db"

const manager = new DatabaseManager("log_hopper_db", "","root", "localhost")



async function sendMetric(inputQuery : string, inputData : unknown[]) {
    let filter: { query: string; data: unknown[] } = {
        query: inputQuery,
        data: inputData
      };
}

export function postMetrics(req : Request, res : Response, next : NextFunction) {
    
    sendMetric("", [])
    res.send()
}

