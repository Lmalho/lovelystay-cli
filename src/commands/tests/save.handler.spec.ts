import { IDatabase } from "pg-promise";
import { IClient } from "pg-promise/typescript/pg-subset";
import { CliConfig, config } from "../../config/config";
import { postgresClient } from "../../database/postgres.client";
import {
  insertLanguages,
  insertUsers,
  insertUserLanguages,
} from "./command.stub";
import { saveHandler } from "../save.command";
import { githubService } from "../../services/github.service";

jest.mock("../../services/github.service");
describe("SaveHandler", () => {
  let cfg: CliConfig;
  let db: IDatabase<any, IClient>;
  let initialUsers;

  beforeAll(() => {
    cfg = config();
    db = postgresClient(cfg);
  });

  beforeEach(async () => {
    const languages = await insertLanguages(db);
    initialUsers = await insertUsers(db);
    await insertUserLanguages(db, initialUsers, languages);
  });

  afterEach(async () => {
    await db.none("DELETE FROM user_languages ");
    await db.none("DELETE FROM users ");
    await db.none("DELETE FROM languages ");
    jest.clearAllMocks();
  });

  it("should insert users", async () => {
    const newUser = await saveHandler("testUser", db, cfg);
    const users = await db.any("SELECT * FROM users");
    const userLanguages = await db.any(
      "SELECT * FROM user_languages WHERE user_id = $1",
      newUser.id,
    );
    expect(githubService.getUserInfo).toHaveBeenCalled();
    expect(githubService.getUserRepos).toHaveBeenCalled();
    expect(githubService.getRepoLanguages).toHaveBeenCalledTimes(2);
    expect(users).toHaveLength(4);
    expect(userLanguages).toHaveLength(2);
  });
  it("should update existing user", async () => {
    await saveHandler(initialUsers[0].login, db, cfg);
    await saveHandler(initialUsers[0].login, db, cfg);
    const users = await db.any("SELECT * FROM users");
    expect(githubService.getUserInfo).toHaveBeenCalledTimes(2);
    expect(githubService.getUserRepos).toHaveBeenCalledTimes(2);
    expect(githubService.getRepoLanguages).toHaveBeenCalledTimes(4);
    expect(users).toHaveLength(4);
  });
});
