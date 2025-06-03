import { Request, Response } from 'express';
import { DatabaseManager } from '../utils/db';

const manager = new DatabaseManager("log_hopper_db", "", "root", "localhost");

// Add a new filter
export const addFilter = async (req: Request, res: Response) => {
    const { userId, field, operator, value } = req.body;

    if (!userId || !field || !operator || value === undefined) {
        return res.status(400).json({ message: 'User ID, field, operator, and value are required.' });
    }

    try {
        await manager.executeQuery(
            "INSERT INTO FILTERS (UserID, Field, Operator, Value) VALUES (?, ?, ?, ?)",
            [userId, field, operator, value]
        );
        res.status(201).json({ message: 'Filter added successfully.' });
    } catch (error) {
        console.error("Error adding filter:", error);
        res.status(500).json({ error: "Failed to add filter." });
    }
};

// Get all filters for a user
export const getFilters = async (req: Request, res: Response) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required.' });
    }

    try {
        const filters = await manager.executeQuery(
            "SELECT Field, Operator, Value FROM FILTERS WHERE UserID = ?",
            [userId]
        );
        res.status(200).json(filters);
    } catch (error) {
        console.error("Error fetching filters:", error);
        res.status(500).json({ error: "Failed to fetch filters." });
    }
};

// Apply filters to logs
export const applyFilters = async (req: Request, res: Response) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required.' });
    }

    try {
        const filters = await manager.executeQuery(
            "SELECT Field, Operator, Value FROM FILTERS WHERE UserID = ?",
            [userId]
        );

        if (filters.length === 0) {
            return res.status(200).json({ message: "No filters found for the user." });
        }

        // Build the WHERE clause dynamically
        const whereClauses = filters.map(
            (filter: any) => `${filter.Field} ${filter.Operator} '${filter.Value}'`
        ).join(" AND ");

        const query = `SELECT * FROM logs WHERE ${whereClauses}`;
        const filteredLogs = await manager.executeQuery(query);

        res.status(200).json(filteredLogs);
    } catch (error) {
        console.error("Error applying filters:", error);
        res.status(500).json({ error: "Failed to apply filters." });
    }
};

// Clear all filters for a user
export const clearFilters = async (req: Request, res: Response) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required.' });
    }

    try {
        await manager.executeQuery("DELETE FROM FILTERS WHERE UserID = ?", [userId]);
        res.status(200).json({ message: 'All filters cleared.' });
    } catch (error) {
        console.error("Error clearing filters:", error);
        res.status(500).json({ error: "Failed to clear filters." });
    }
};