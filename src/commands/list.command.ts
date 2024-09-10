import { Command } from "commander";
import { findUsers } from "../database/users/user.repository";
import { IDatabase } from "pg-promise";
import { IClient } from "pg-promise/typescript/pg-subset";

export type ListOptions = {
  location?: string;
  language?: string;
};

export const listCommand = (db: IDatabase<any, IClient>) => {
  return new Command()
    .command("list")
    .description("List all users")
    .option("-l, --location <location>", "Filter by location")
    .option("-p, --language <language>", "Filter by programming language")
    .action(async (options?: ListOptions) => {
      const now = new Date();
      await listHandler(db, options);
      console.log(`Execution time: ${new Date().getTime() - now.getTime()}ms`);
      process.exit(0);
    });
};

export const listHandler = async (
  db: IDatabase<any, IClient>,
  options?: ListOptions,
) => {
  let filter;
  if (options) {
    filter = {
      ...options,
    };
  }

  console.table(await findUsers(db, filter));
  return;
};
