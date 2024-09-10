import { IDatabase } from "pg-promise";
import { IClient } from "pg-promise/typescript/pg-subset";
import { GithubUserInfo } from "../../services/github.service";
import { userLanguagesSql, usersSql } from "./user.sql";
import { getLanguages } from "../languages/language.repository";

export type User = {
  id: number;
  user_name: string;
  name: string;
  location: string;
  html_url: string;
  repos_url: string;
};

export const saveUserWithLanguages = async (
  db: IDatabase<any, IClient>,
  userInfo: GithubUserInfo,
  userLanguages: string[],
) => {
  const languagesIds = await getLanguages(db, userLanguages);

  const newUser = await insertUser(db, userInfo);

  if (languagesIds.length > 0) {
    await addUserLanguages(
      db,
      newUser.id,
      languagesIds.map((l) => l.id),
    );
  }

  return [newUser, languagesIds];
};

const insertUser = async (
  db: IDatabase<any, IClient>,
  userInfo: GithubUserInfo,
): Promise<User> => {
  return db.one(usersSql.add, [
    userInfo.login,
    userInfo.name,
    userInfo.location,
    userInfo.html_url,
    userInfo.repos_url,
  ]);
};

const addUserLanguages = async (
  db: IDatabase<any, IClient>,
  userId: number,
  languages: number[],
) => {
  return Promise.all(
    languages.map((l) => {
      return db.none(userLanguagesSql.add, [userId, l]);
    }),
  );
};
