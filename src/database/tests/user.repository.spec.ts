import { CliConfig, config } from "../../config/config";
import { postgresClient } from "../postgres.client";
import { IDatabase } from "pg-promise";
import { IClient } from "pg-promise/typescript/pg-subset";
import { findOneUser, findUsers, saveUser } from "../users/user.repository";
import { generateUser, languages } from "./user.stub";
import { languagesSql } from "../languages/language.sql";
describe("UserRepository", () => {
  let cfg: CliConfig;
  let db: IDatabase<any, IClient>;
  beforeAll(async () => {
    cfg = config();

    db = postgresClient(cfg) as IDatabase<any, IClient>;

    await db.none(languagesSql.add, "Javascript");
    await db.none(languagesSql.add, "Typescript");
  });

  afterEach(async () => {
    await db.none("DELETE FROM user_languages ");
    await db.none("DELETE FROM users ");
    await db.none("DELETE FROM languages ");
  });
  it("should create a new user", async () => {
    const reqUser = generateUser();
    const user = await saveUser(db, reqUser, reqUser.repo_count, languages);

    expect(user).toMatchObject(reqUser);
  });

  it("should find a user", async () => {
    const reqUser = generateUser();
    await saveUser(db, reqUser, reqUser.repo_count, languages);

    const user = await findOneUser(db, reqUser.login);

    expect(user).toMatchObject(reqUser);
  });

  it("should not find a user", async () => {
    const user = await findOneUser(db, "unknown");

    expect(user).toBeNull();
  });

  it("should find users", async () => {
    const reqUser = generateUser();
    await saveUser(db, reqUser, reqUser.repo_count, languages);

    const users = await findUsers(db);

    expect(users).toHaveLength(1);
  });

  it("should find users by language", async () => {
    await db.none(languagesSql.add, "Go");
    const reqUser = generateUser();
    await saveUser(db, reqUser, reqUser.repo_count, ["Go"]);
    const users = await findUsers(db, { language: "Go" });

    expect(users).toHaveLength(1);
    expect(users[0]).toMatchObject(reqUser);
    expect(users[0].languages).toContain("Go");
  });

  it("should find users by location", async () => {
    const reqUser = generateUser();
    await saveUser(db, reqUser, reqUser.repo_count, languages);
    const users = await findUsers(db, { location: reqUser.location });

    expect(users).toHaveLength(1);
    expect(users[0]).toMatchObject(reqUser);
  });

  it("should find users by location and language", async () => {
    await db.none(languagesSql.add, "C#");
    const reqUser = generateUser();
    await saveUser(db, reqUser, reqUser.repo_count, ["C#"]);
    const users = await findUsers(db, {
      location: reqUser.location,
    });
    expect(users).toHaveLength(1);
    expect(users[0]).toMatchObject(reqUser);
    expect(users[0].languages).toContain("C#");
  });
});
