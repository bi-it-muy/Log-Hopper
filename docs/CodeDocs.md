# Database

# DatabaseManager Class

The `DatabaseManager` class provides an interface for connecting to a MariaDB database and executing SQL queries. It simplifies database interactions by managing connections and query execution.

## Usage
```typescript
// Example usage
(async () => {
    const dbManager = new DatabaseManager('your_db_name', 'your_password', 'your_user', 'your_host');
    try {
        const result = await dbManager.executeQuery('Your qurry');
        console.log("Query result:", result);
    } catch (error) {
        console.error("Database operation failed:", error);
    }
})();
```
