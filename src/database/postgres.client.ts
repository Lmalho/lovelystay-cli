import pgPromise from "pg-promise";
import { CliConfig } from "src/config/config";

export const postgresClient = (config: CliConfig) => {
  return pgPromise()({
    host: config.db.host,
    port: config.db.port,
    password: config.db.password,
    user: config.db.username,
    database: "postgres",
  });
};
