import { Command } from "commander";
import { IDatabase } from "pg-promise";
import { IClient } from "pg-promise/typescript/pg-subset";
import { CliConfig } from "../config/config";
import { GithubRepo, githubService } from "../services/github.service";
import { saveUser } from "../database/users/user.repository";
import { validateGithubUsername } from "../common/input.validation";

export const saveCommand = (db: IDatabase<any, IClient>, cfg: CliConfig) => {
  return new Command()
    .command("save <username>")
    .description("Save user info from Github to the database")
    .action(async (username: string) => {
      validateUsername(username);
      const response = await saveHandler(username, db, cfg);
      console.table([response]);
      process.exit(0);
    });
};

export const saveHandler = async (
  username: string,
  db: IDatabase<any, IClient>,
  cfg: CliConfig,
) => {
  const [userInfo, userRepos] = await Promise.all([
    githubService.getUserInfo(username, cfg.github?.token),
    githubService.getUserRepos(username, cfg.github?.token),
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
  return saveUser(db, userInfo, userRepos.length, userLanguages);
};

const getLanguages = async (
  username: string,
  userRepos: GithubRepo[],
  cfg: CliConfig,
) => {
  return Promise.all(
    userRepos.map(async (repo) => {
      const repoLanguages = await githubService.getRepoLanguages(
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

const validateUsername = (username: string) => {
  if (!validateGithubUsername(username)) {
    console.error(`${username} is not a valid Github username`);
    process.exit(0);
  }
  return;
};
