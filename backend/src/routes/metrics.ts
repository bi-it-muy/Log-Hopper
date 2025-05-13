import { NextFunction, Request, Response } from "express";
import { DatabaseManager } from "../utils/db"
import  "prom-client"
import {UploadedFile, FileArray, } from "express-fileupload" 
import fs from "fs"
import path from "path"

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

export function upload(req: Request, res: Response) {
    // Ensure files exist
    if (!req.files || !req.files.sampleFile) {
        res.status(400).send('No files were uploaded.');
        return
    }

    const fileField = req.files.sampleFile;

    // Reject multiple file uploads
    if (Array.isArray(fileField)) {
        res.status(400).send('Multiple files not supported for this field.');
        return
    }

    const sampleFile = fileField as UploadedFile;

    // Ensure upload directory exists
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const uploadPath = path.join(uploadDir, sampleFile.name);

    sampleFile.mv(uploadPath, (err) => {
        if (err) return res.status(500).send(err);
        res.send('File uploaded!');
    });
}

export async function getSettings(req: Request, res: Response) {
    try {
        const settings = await manager.executeQuery("SELECT * FROM settings", []);
        res.status(200).json(settings);
    } catch (error) {
        console.error("Error fetching settings:", error);
        res.status(500).json({ error: "Failed to fetch settings" });
    }
}

export async function postSettings(req: Request, res: Response) {
    const { key, value } = req.body;

    if (!key || value === undefined) {
        return res.status(400).json({ error: "Key and value are required" });
    }

    try {
        await manager.executeQuery("INSERT INTO settings (key, value) VALUES (?, ?)", [key, value]);
        res.status(201).json({ message: "Setting added successfully" });
    } catch (error) {
        console.error("Error adding setting:", error);
        res.status(500).json({ error: "Failed to add setting" });
    }
}

export async function putSettings(req: Request, res: Response) {
    const { key, value } = req.body;

    if (!key || value === undefined) {
        return res.status(400).json({ error: "Key and value are required" });
    }

    try {
        const result = await manager.executeQuery("UPDATE settings SET value = ? WHERE key = ?", [value, key]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Setting not found" });
        }

        res.status(200).json({ message: "Setting updated successfully" });
    } catch (error) {
        console.error("Error updating setting:", error);
        res.status(500).json({ error: "Failed to update setting" });
    }
}

export async function deleteSettings(req: Request, res: Response) {
    const { key } = req.body;

    if (!key) {
        return res.status(400).json({ error: "Key is required" });
    }

    try {
        const result = await manager.executeQuery("DELETE FROM settings WHERE key = ?", [key]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Setting not found" });
        }

        res.status(200).json({ message: "Setting deleted successfully" });
    } catch (error) {
        console.error("Error deleting setting:", error);
        res.status(500).json({ error: "Failed to delete setting" });
    }
}