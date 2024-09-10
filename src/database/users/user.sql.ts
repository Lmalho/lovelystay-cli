export const usersSql = {
  add: "INSERT INTO users(login, name, location, html_url, repos_url)\
   VALUES($1, $2, $3, $4, $5)\
   ON CONFLICT (login) DO UPDATE SET name = $2,\
   location = $3, html_url = $4, repos_url = $5\
   RETURNING *",
  findOne:
    "SELECT u.login, u.name, u.location, u.html_url, u.repos_url, l.name as languages \
   FROM users u\
   LEFT JOIN user_languages ul ON u.id = ul.user_id\
   LEFT JOIN languages l ON ul.language_id = l.id\
   WHERE u.login = $1",
  find: (language?: string, location?: string) => {
    let query =
      "SELECT u.id, u.login, u.name, u.location, u.html_url, u.repos_url, l.name as languages \
    FROM users u\
    LEFT JOIN user_languages ul ON u.id = ul.user_id\
    LEFT JOIN languages l ON ul.language_id = l.id\
    WHERE TRUE";

    if (language) {
      query += " AND l.name = $1";
    }

    if (location) {
      query += " AND u.location = $2";
    }

    return query;
  },
};

export const userLanguagesSql = {
  add: "INSERT INTO user_languages(user_id, language_id)\
     VALUES($1, $2)\
     ON CONFLICT (user_id, language_id) DO NOTHING",
};
