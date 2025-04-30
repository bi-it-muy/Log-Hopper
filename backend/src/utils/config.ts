import fs from 'fs';
import path from 'path';

// Load configuration from JSON file
const configPath = path.resolve(__dirname, '../../config/config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

// Accessing configuration values

function configObj() {
const configObj : {dbHost : string, dbUser : string, dbPassword : string, port : number} = {
 dbHost : config.DB_HOST,
 dbUser : config.DB_USER,
 dbPassword : config.DB_PASSWORD,
 port: config.PORT,
}
    return configObj
}

const result = configObj()
console.log('Database Host:', result.dbHost);
console.log('Database User:', result.dbUser );
console.log('Database Password:', result.dbPassword);
console.log('Port:', result.port);

export default configObj;