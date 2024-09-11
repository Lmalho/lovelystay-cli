import { Command } from "commander";
import { IDatabase } from "pg-promise";
import { IClient } from "pg-promise/typescript/pg-subset";
import { CliConfig, config } from "../../config/config";
import { postgresClient } from "../../database/postgres.client";
import { saveCommand } from "../save.command";

describe("SaveCommand", () => {
  let program: Command;
  let cfg: CliConfig;
  let db: IDatabase<any, IClient>;
  let mockExit: jest.SpyInstance;
  let mockConsoleError: jest.SpyInstance;
  beforeAll(() => {
    cfg = config();
    db = postgresClient(cfg);
  });

  beforeEach(() => {
    program = new Command();
    program.exitOverride().addCommand(saveCommand(db, cfg));
    mockExit = jest.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("process.exit called");
    });
    mockConsoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
  });
  afterEach(() => {
    jest.clearAllMocks();
    process.argv = [];
  });
  it("should be defined", () => {
    expect(program).toBeDefined();
  });

  it("should return error message if username is invalid", async () => {
    await expect(
      program.parseAsync(["save", "wrong;$"], { from: "user" }),
    ).rejects.toThrow("process.exit called");
    expect(mockConsoleError).toHaveBeenCalledWith(
      "wrong;$ is not a valid Github username",
    );
  });
});
