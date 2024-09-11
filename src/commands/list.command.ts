import { Command } from "commander";
import { Filter, findUsers } from "../database/users/user.repository";
import { IDatabase } from "pg-promise";
import { IClient } from "pg-promise/typescript/pg-subset";
import {
  validateLocation,
  validateProgrammingLanguage,
} from "../common/input.validation";

export const listCommand = (db: IDatabase<any, IClient>) => {
  return new Command()
    .command("list")
    .description("List all users")
    .option("-l, --location <location>", "Filter by location")
    .option("-p, --language <language>", "Filter by programming language")
    .action(async (options?: Filter) => {
      validateOptions(options);
      const response = await listHandler(db, options);
      console.table(response);
      process.exit(0);
    });
};

export const listHandler = (db: IDatabase<any, IClient>, options?: Filter) => {
  let filter;
  if (options) {
    filter = {
      ...options,
    };
  }
  return findUsers(db, filter);
};

const validateOptions = (options: Filter) => {
  if (options.location && !validateLocation(options.location)) {
    console.error(`${options.location} is not a valid location`);
    process.exit(0);
  }
  if (options.language && !validateProgrammingLanguage(options.language)) {
    console.error("${options.language} is not a valid language");
    process.exit(0);
  }
  return;
};
