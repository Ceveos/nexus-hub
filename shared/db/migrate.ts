import { migrate } from "drizzle-orm/postgres-js/migrator";

console.log(process.env.DATABASE_URL);

import db from "./db";

export const migrateDB = async () => {
  console.log("migrating db");
  try {
    await migrate(db, { migrationsFolder: "drizzle" });
  } catch (exception) {
    console.log(exception);
  }
  console.log("db migrated");
};

migrateDB();
