import { PostgreSqlContainer } from "@testcontainers/postgresql";
import * as path from "path";
import { GenericContainer, Network } from "testcontainers";

const initPostgres = async () => {
  const network = await new Network().start();

  const pgContainer = await new PostgreSqlContainer("postgres:15-alpine")
    .withNetwork(network)
    .withNetworkAliases("postgres")
    .start();

  process.env.DB_USER = pgContainer.getUsername();
  process.env.DB_PASSWORD = pgContainer.getPassword();
  process.env.DB_NAME = pgContainer.getDatabase();
  process.env.DB_HOST = pgContainer.getHost();
  process.env.DB_PORT = pgContainer.getMappedPort(5432).toString();

  const migrationPath = path.resolve(__dirname, "../database/migrations");

  const migrationContainer = await new GenericContainer(
    "ghcr.io/kukymbr/goose-docker:3.20.0",
  )
    .withEnvironment({
      GOOSE_DRIVER: "postgres",
      GOOSE_DBSTRING: `host=postgres \
      port=5432 \
      user=${pgContainer.getUsername()} \
      password=${pgContainer.getPassword()} \
      dbname=${pgContainer.getDatabase()}`,
    })
    .withBindMounts([
      {
        source: migrationPath,
        target: "/migrations",
        mode: "ro",
      },
    ])
    .withNetwork(network)
    .start();

  global.__POSTGRES__ = pgContainer;
  global.__MIGRATION__ = migrationContainer;
};

export = async function globalSetup() {
  await initPostgres();
};
