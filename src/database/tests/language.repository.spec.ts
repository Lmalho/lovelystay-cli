import { IDatabase } from "pg-promise";
import { IClient } from "pg-promise/typescript/pg-subset";
import { CliConfig, config } from "../../config/config";
import { languagesSql } from "../languages/language.sql";
import { postgresClient } from "../postgres.client";
import { findLanguages } from "../languages/language.repository";

describe("LanguageRepository", () => {
  let cfg: CliConfig;
  let db: IDatabase<any, IClient>;
  beforeAll(async () => {
    cfg = config();

    db = postgresClient(cfg) as IDatabase<any, IClient>;

    await db.none(languagesSql.add, "Go");
    await db.none(languagesSql.add, "Rust");
  });

  it("should find a language", async () => {
    const foundLanguage = await findLanguages(db, ["Go", "Rust"]);
    expect(foundLanguage).toMatchObject([{ name: "Go" }, { name: "Rust" }]);
  });

  it("should not find a language", async () => {
    const language = "Javascript";
    const foundLanguage = await findLanguages(db, [language]);

    expect(foundLanguage).toHaveLength(0);
  });
});
