import { IDatabase } from "pg-promise";
import { IClient } from "pg-promise/typescript/pg-subset";
import { CliConfig, config } from "../../config/config";
import { postgresClient } from "../../database/postgres.client";
import { listHandler } from "../list.command";
import {
  insertUsers,
  insertLanguages,
  insertUserLanguages,
} from "./command.stub";

describe("ListHandler", () => {
  let cfg: CliConfig;
  let db: IDatabase<any, IClient>;

  beforeAll(() => {
    cfg = config();
    db = postgresClient(cfg);
  });

  beforeEach(async () => {
    const languages = await insertLanguages(db);
    const users = await insertUsers(db);
    await insertUserLanguages(db, users, languages);
  });

  afterEach(async () => {
    await db.none("DELETE FROM user_languages ");
    await db.none("DELETE FROM users ");
    await db.none("DELETE FROM languages ");
  });
  it("should list all users", async () => {
    const users = await listHandler(db);
    expect(users).toHaveLength(3);
  });

  it("should list users by language", async () => {
    const users = await listHandler(db, { language: "Java" });
    expect(users).toHaveLength(2);
  });

  it("should list users by location", async () => {
    const users = await listHandler(db, { location: "Porto" });
    expect(users).toHaveLength(2);
  });
  it("should list users by location and language", async () => {
    const users = await listHandler(db, {
      location: "Porto",
      language: "Java",
    });
    expect(users).toHaveLength(1);
  });

  it("should not list users if no filter match", async () => {
    const users = await listHandler(db, { location: "California" });
    expect(users).toHaveLength(0);
  });
});
