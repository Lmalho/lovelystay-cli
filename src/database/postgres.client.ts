import * as pgPromise from "pg-promise";
import { CliConfig } from "../config/config";
import { IDatabase } from "pg-promise";
import { IClient } from "pg-promise/typescript/pg-subset";

export const postgresClient = (config: CliConfig): IDatabase<any, IClient> => {
  const pgp = pgPromise({});
  const db = pgp({
    host: config.db.host,
    port: config.db.port,
    password: config.db.password,
    user: config.db.username,
    database: config.db.name,
  });

  return db;
};
