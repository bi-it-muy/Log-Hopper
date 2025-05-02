import mariadb from 'mariadb';

/**
 * Manages connections and queries to a MariaDB database.
 * 
 * @class DatabaseManager
 */
class DatabaseManager {
    readonly dbHost: string;
    readonly dbName: string;
    readonly dbPassword: string;
    readonly dbUser: string;

    /**
     * Creates an instance of DatabaseManager.
     * 
     * @param dbName - The name of the database to connect to.
     * @param dbPassword - The password for the database user.
     * @param dbUser - The username used to authenticate with the database.
     * @param dbHost - The host address of the database server.
     */
    constructor(dbName: string, dbPassword: string, dbUser: string, dbHost: string) {
        this.dbName = dbName;
        this.dbPassword = dbPassword;
        this.dbUser = dbUser;
        this.dbHost = dbHost;
    }

    /**
     * Establishes a connection to the MariaDB database.
     * 
     * @returns A Promise that resolves to a MariaDB connection object.
     * @throws If the connection fails, the error is logged and rethrown.
     * 
     * @private
     */
    private async conn() {
        let connection;
        try {
            connection = await mariadb.createConnection({
                host: this.dbHost,
                user: this.dbUser,
                password: this.dbPassword,
                database: this.dbName
            });
            console.log("Connected to the database!");
            return connection;
        } catch (err) {
            console.error("Error connecting to the database:", err);
            throw err;
        }
    }

    /**
     * Executes a parameterized SQL query using a safe connection.
     * 
     * @param query - The SQL query string to execute. It should contain placeholders for parameters.
     * @param list - An array of values to safely substitute into the query.
     * @returns A Promise that resolves to the query result.
     * @throws If the query execution fails, the error is logged and rethrown.
     */
    async executeQuery(query: string, list: unknown[]) {
        let connection;
        try {
            connection = await this.conn();
            const result = await connection.execute(query, list);
            return result;
        } catch (err) {
            console.error("Error executing query:", err);
            throw err;
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    }
}

export  {DatabaseManager};