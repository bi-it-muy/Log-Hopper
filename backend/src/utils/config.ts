import fs from 'fs';
import path from 'path';

// Load configuration from JSON file
const configPath = path.resolve(__dirname, '../../config/config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

// Accessing configuration values

function configObj() {
 const configObj : {dbHost : string, dbUser : string, dbPassword : string,dbName : string, port : number, frontendIp : string, dbIp : string}  = {
 dbHost : config.DB_HOST,
 dbName : config.DB_NAME,
 dbUser : config.DB_USER,
 dbPassword : config.DB_PASSWORD,
 frontendIp : config.FRONTEND_IP,
 dbIp : config.DB_IP,
 port: config.PORT,

}
    return configObj
}

const result = configObj()
console.log('Database Host:', result.dbHost);
console.log('Database User:', result.dbUser );
console.log('Database Password:', result.dbPassword);
console.log('Database Name', result.dbName)
console.log('Frontend IP', result.frontendIp)
console.log('Database IP', result.dbIp)
console.log('Port:', result.port);

export default configObj;