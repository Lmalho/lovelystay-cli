import { Command } from "commander";
import { IDatabase } from "pg-promise";
import { IClient } from "pg-promise/typescript/pg-subset";
import { CliConfig } from "../config/config";
import {
  getGithubUserInfo,
  getGithubUserRepos,
  GithubRepo,
  getGithubRepoLanguages,
} from "../services/github.service";
import { saveUser } from "../database/users/user.repository";

export const saveCommand = (db: IDatabase<any, IClient>, cfg: CliConfig) => {
  return new Command()
    .command("save <username>")
    .description("Save user info from Github to the database")
    .action(async (username: string) => {
      saveHandler(username, db, cfg);
      process.exit(0);
    });
};

export const saveHandler = async (
  username: string,
  db: IDatabase<any, IClient>,
  cfg: CliConfig,
) => {
  const [userInfo, userRepos] = await Promise.all([
    getGithubUserInfo(username, cfg.github?.token),
    getGithubUserRepos(username, cfg.github?.token),
  ]);

  if (userInfo instanceof Error) {
    console.error(userInfo.message);
    return;
  }

  if (userRepos instanceof Error) {
    console.error(userRepos.message);
    return;
  }

  const userLanguages = await getLanguages(username, userRepos, cfg);
  console.table([
    await saveUser(db, userInfo, userRepos.length, userLanguages),
  ]);
  return;
};

const getLanguages = async (
  username: string,
  userRepos: GithubRepo[],
  cfg: CliConfig,
) => {
  return Promise.all(
    userRepos.map(async (repo) => {
      const repoLanguages = await getGithubRepoLanguages(
        username,
        repo.name,
        cfg.github?.token,
      );
      return repoLanguages;
    }),
  ).then((languages) => {
    const uLang = new Set<string>();
    languages.forEach((lang) => {
      Object.keys(lang).forEach((l) => {
        uLang.add(l);
      });
    });
    return Array.from(uLang);
  });
};
