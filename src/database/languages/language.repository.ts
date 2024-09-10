import { IDatabase } from "pg-promise";
import { IClient } from "pg-promise/typescript/pg-subset";
import { languagesSql } from "./language.sql";

export type Language = {
  id: number;
  name: string;
};

export const getLanguages = async (
  db: IDatabase<any, IClient>,
  languages: string[],
): Promise<Language[]> => {
  if (!languages.length) {
    return [];
  }
  return db.manyOrNone<Language>(languagesSql.find, [languages]);
};
