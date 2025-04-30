// FIXME: Find BUG that that messes with users.ts
import mariadb from 'mariadb';

class DatabaseManager {
    dbHost: string;
    dbName: string;
    dbPassword: string;
    dbUser : string;

    constructor(dbName: string, dbPassword: string, dbUser : string, dbHost: string) {
        this.dbName = dbName;
        this.dbPassword = dbPassword;
        this.dbUser  = dbUser ;
        this.dbHost = dbHost;
    }

    private async conn() {
        let connection;
        try {
            connection = await mariadb.createConnection({
                host: this.dbHost,
                user: this.dbUser ,
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

    async executeQuery(query: string) {
        let connection;
        try {
            connection = await this.conn(); 
            const result = await connection.query(query); 
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