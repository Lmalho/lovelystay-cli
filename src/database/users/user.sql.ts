export const usersSql = {
  add: "INSERT INTO users(user_name, name, location, html_url, repos_url)\
   VALUES($1, $2, $3, $4, $5)\
   RETURNING *",
  find: "",
};

export const userLanguagesSql = {
  add: "INSERT INTO user_languages(user_id, language_id)\
     VALUES($1, $2)",
};
