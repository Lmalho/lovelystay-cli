import axios from "axios";
import * as yaml from "js-yaml";
import { postgresClient } from "../database/postgres.client";
import { config } from "../config/config";

const seed = async () => {
  const cfg = config();
  const db = postgresClient(cfg);
  if (db instanceof Error) {
    console.error(db.message);
    return;
  }
  //   const language = await axios.get();
  const response = await axios.get(
    "https://raw.githubusercontent.com/github/linguist/master/lib/linguist/languages.yml",
  );
  const data = yaml.load(response.data) as object;
  const languageList = Object.keys(data);

  db.tx((t) => {
    const queries = languageList.map((l) => {
      return t.none("INSERT INTO languages (name) VALUES ($1) ", l);
    });
    return t.batch(queries);
  })
    .then(() => {
      // SUCCESS
      console.log("Languages inserted successfully");
      return;
    })
    .catch((error) => {
      // ERROR
      console.error(error);
      return;
    });
};

seed();
