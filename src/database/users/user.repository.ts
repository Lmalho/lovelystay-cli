import { IDatabase } from "pg-promise";
import { IClient } from "pg-promise/typescript/pg-subset";
import { GithubUserInfo } from "../../services/github.service";
import { userLanguagesSql, usersSql } from "./user.sql";
import { findLanguages } from "../languages/language.repository";

export type DbUser = {
  id: number;
  login: string;
  name: string;
  location: string;
  html_url: string;
  repos_url: string;
};

export type User = {
  id: number;
  login: string;
  name: string;
  location: string;
  html_url: string;
  repos_url: string;
  languages: string[];
};

export type Filter = {
  location?: string;
  language?: string;
};

export const saveUser = async (
  db: IDatabase<any, IClient>,
  userInfo: GithubUserInfo,
  userLanguages: string[],
) => {
  const languages = await findLanguages(db, userLanguages);

  const newUser = await insertUser(db, userInfo);

  if (languages.length > 0) {
    await addUserLanguages(
      db,
      newUser.id,
      languages.map((l) => l.id),
    );
  }

  return { ...newUser, languages: languages.map((l) => l.name) } as User;
};

export const findOneUser = async (
  db: IDatabase<any, IClient>,
  login: string,
) => {
  const result = await db.manyOrNone(usersSql.findOne, login);

  if (!result || result.length === 0) {
    return null;
  }
  const user: User = result.reduce((acc: User, curr) => {
    return reduceUser(acc, curr);
  }, null);
  return user;
};

export const findUsers = async (
  db: IDatabase<any, IClient>,
  filter?: Filter,
) => {
  const result = await db.manyOrNone(
    usersSql.find(filter?.language, filter?.location),
    [filter?.language || null, filter?.location || null],
  );

  if (!result || result.length === 0) {
    return [];
  }

  const map = new Map<number, User>();

  result.forEach((curr) => {
    const user = map.get(curr.id);
    if (user) {
      reduceUser(user, curr);
    } else {
      map.set(curr.id, reduceUser(null, curr));
    }
  });

  const users: User[] = Array.from(map.values());

  return users;
};
const insertUser = async (
  db: IDatabase<any, IClient>,
  userInfo: GithubUserInfo,
): Promise<DbUser> => {
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

const reduceUser = (acc: User, curr: any) => {
  if (!acc) {
    return {
      ...curr,
      languages: curr.languages ? [curr.languages] : [],
    };
  }
  if (!acc.languages.includes(curr.languages)) {
    acc.languages.push(curr.languages);
  }
  return acc;
};
