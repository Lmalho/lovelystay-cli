import { Command } from "commander";
import { config } from "./config/config";
import { postgresClient } from "./database/postgres.client";
import { commandRoute } from "./commands/command.route";

const main = () => {
  const cfg = config();
  const db = postgresClient(cfg);

  const program = new Command();

  program
    .version("0.0.1")
    .description(
      "CLI for saving and retrieving Github user info from a database",
    );

  commandRoute.reduce((acc, curr) => acc.addCommand(curr(db, cfg)), program);

  program.parse(process.argv);
};

main();
