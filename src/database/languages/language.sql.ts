export const languagesSql = {
  add: "INSERT INTO languages (name)VALUES ($1)",
  find: "SELECT * FROM languages WHERE name IN($1:csv)",
};
