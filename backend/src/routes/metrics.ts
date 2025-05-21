import { NextFunction, Request, Response } from "express";
import { DatabaseManager } from "../utils/db"
import { Counter, Gauge, Histogram, Summary, register } from 'prom-client';
import { UploadedFile, FileArray, } from "express-fileupload"
import fs from "fs"
import path from "path"
import configObj from "../utils/config";

const config = configObj()
const manager = new DatabaseManager(config.dbName, "", "root", config.dbIp);



async function sendMetric(inputQuery: string, inputData: string[]) {
    let filter = {
        query: inputQuery,
        data: inputData
    };


    try {
        //const result = await manager.executeQuery(filter.query, filter.data);
        console.log("Metrics sent successfully:", filter);
    } catch (error) {
        console.error("Error sending metrics:", error);
    }
}


export function postMetrics(req: Request, res: Response, next: NextFunction) {
    if (!req.body) {
        res.status(400).send('No data provided.');
        return;
    }
    const { query, data } = req.body;
    if (!query || !data) {
        res.status(400).send('Query and data are required.');
        return;
    }
    sendMetric(query, data);
    res.status(200).send('Metric data received.');
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
        res.status(400).json({ error: "Key and value are required" });
        return;
    }

    try {
        const result = await manager.executeQuery("UPDATE settings SET value = ? WHERE key = ?", [value, key]);

        if (result.affectedRows === 0) {
            res.status(404).json({ error: "Setting not found" });
            return;
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
        res.status(400).json({ error: "Key is required" });
        return;
    }

    try {
        const result = await manager.executeQuery("DELETE FROM settings WHERE key = ?", [key]);

        if (result.affectedRows === 0) {
            res.status(404).json({ error: "Setting not found" });
            return;
        }

        res.status(200).json({ message: "Setting deleted successfully" });
    } catch (error) {
        console.error("Error deleting setting:", error);
        res.status(500).json({ error: "Failed to delete setting" });
    }
}



// Define custom metrics
const logCounter = new Counter({
    name: 'log_hopper_processed_logs_total',
    help: 'Total number of processed logs',
});

const errorCounter = new Counter({
    name: 'log_hopper_errors_total',
    help: 'Total number of errors',
});

const logProcessingTime = new Histogram({
    name: 'log_hopper_processing_time_seconds',
    help: 'Histogram of log processing times',
    buckets: [0.1, 0.5, 1, 2, 5], // Define buckets for the histogram
});

// Register metrics
register.registerMetric(logCounter);
register.registerMetric(errorCounter);
register.registerMetric(logProcessingTime);

// Example function to simulate log processing
export async function processLogs(req: Request, res: Response) {
    const start = Date.now();

    try {
        // Simulate log processing
        logCounter.inc(); // Increment the log counter
        await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000)); // Simulate processing time

        const duration = (Date.now() - start) / 1000;
        logProcessingTime.observe(duration); // Record processing time

        res.status(200).send('Logs processed successfully');
    } catch (error) {
        errorCounter.inc(); // Increment the error counter
        res.status(500).send('Failed to process logs');
    }
}