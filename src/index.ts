#!/usr/bin/env node

import { Command } from "commander";
import { config } from "./config/config";
import { postgresClient } from "./database/postgres.client";
import { commandRoute } from "./commands/command.route";

const main = async () => {
  try {
    const cfg = config();
    const db = postgresClient(cfg);
    const program = new Command();

    program
      .version("0.0.1")
      .description(
        "CLI for saving and retrieving Github user info from a database",
      );

    commandRoute.reduce((acc, curr) => acc.addCommand(curr(db, cfg)), program);

    await program.parseAsync(process.argv);
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  }
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
main().then(() => {});
