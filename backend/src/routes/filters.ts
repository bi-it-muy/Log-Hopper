import { Request, Response } from 'express';

interface Filter {
    field: string;
    value: any;
}

let filters: Filter[] = [];

// Add a new filter
export const addFilter = (req: Request, res: Response) => {
    const { field, value } = req.body;

    if (!field || value === undefined) {
        return res.status(400).json({ message: 'Field and value are required.' });
    }

    filters.push({ field, value });
    res.status(201).json({ message: 'Filter added successfully.', filters });
};

// Get all filters
export const getFilters = (_req: Request, res: Response) => {
    res.status(200).json(filters);
};

// Apply filters to data
export const applyFilters = (req: Request, res: Response) => {
    const data = req.body;

    if (!Array.isArray(data)) {
        return res.status(400).json({ message: 'Data must be an array.' });
    }

    const filteredData = data.filter((item) =>
        filters.every((filter) => item[filter.field] === filter.value)
    );

    res.status(200).json(filteredData);
};

// Clear all filters
export const clearFilters = (_req: Request, res: Response) => {
    filters = [];
    res.status(200).json({ message: 'All filters cleared.' });
};