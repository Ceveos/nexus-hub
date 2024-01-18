import { drizzle } from "drizzle-orm/postgres-js/driver";
import postgres = require("postgres");

const connectionString = process.env.DATABASE_URL;
const sql = postgres(connectionString, { max: 1 })
const db = drizzle(sql);

console.log(connectionString)
export default db;