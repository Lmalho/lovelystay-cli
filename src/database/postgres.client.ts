import * as pgPromise from "pg-promise";
import { CliConfig } from "../config/config";
import { IDatabase } from "pg-promise";
import { IClient } from "pg-promise/typescript/pg-subset";

export const postgresClient = (
  config: CliConfig,
): IDatabase<any, IClient> | Error => {
  const pgp = pgPromise({});
  const db = pgp({
    host: config.db.host,
    port: config.db.port,
    password: config.db.password,
    user: config.db.username,
    database: config.db.name,
  });

  db.connect()
    .then((obj) => {
      obj.done(); // success, release the connection
    })
    .catch((error) => {
      return Error(
        `ERROR connecting to the database:${error.message || error}`,
      );
    });
  return db;
};
