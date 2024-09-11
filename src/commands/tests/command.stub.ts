import { languagesSql } from "../../database/languages/language.sql";
import { generateUser } from "../../database/tests/user.stub";
import { userLanguagesSql, usersSql } from "../../database/users/user.sql";

export const insertUsers = (db) => {
  const user1 = generateUser();
  const user2 = generateUser();
  const user3 = generateUser();
  return Promise.all([
    db.one(usersSql.add, [
      user1.login,
      user1.name,
      "Lisbon",
      2,
      user1.html_url,
    ]),
    db.one(usersSql.add, [user2.login, user2.name, "Porto", 2, user2.html_url]),
    db.one(usersSql.add, [user3.login, user3.name, "Porto", 2, user3.html_url]),
  ]);
};

export const insertLanguages = async (db) => {
  const query = "INSERT INTO languages (name)VALUES ($1) RETURNING *";
  return Promise.all([db.one(query, "Java"), db.one(query, "Shell")]);
};

export const insertUserLanguages = async (db, users, languages) => {
  return Promise.all([
    db.none(userLanguagesSql.add, [users[0].id, languages[0].id]),
    db.none(userLanguagesSql.add, [users[0].id, languages[1].id]),
    db.none(userLanguagesSql.add, [users[1].id, languages[0].id]),
    db.none(userLanguagesSql.add, [users[2].id, languages[1].id]),
  ]);
};
