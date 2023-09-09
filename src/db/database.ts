import { DB } from "kysely-codegen";
import SQLite from "better-sqlite3";
import { Kysely, SqliteDialect } from "kysely";
import { ensureDefined } from "../common/util";

const DATABASE_URL = process.env.DATABASE_URL;

const dialect = new SqliteDialect({
  database: new SQLite(ensureDefined(DATABASE_URL)),
});

export const db = new Kysely<DB>({
  dialect,
});
