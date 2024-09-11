import { Command } from "commander";
import { listCommand } from "../list.command";
import { postgresClient } from "../../database/postgres.client";
import { CliConfig, config } from "../../config/config";
import { IDatabase } from "pg-promise";
import { IClient } from "pg-promise/typescript/pg-subset";

describe("ListCommand", () => {
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
    program.exitOverride().addCommand(listCommand(db));
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

  it("should return error if wrong option is passed", async () => {
    await expect(
      program.parseAsync(["list", "--wrong"], { from: "user" }),
    ).rejects.toThrow("process.exit called");
  });

  it("should return error if wrong flag is passed", async () => {
    await expect(
      program.parseAsync(["list", "--location"], { from: "user" }),
    ).rejects.toThrow("process.exit called");
  });

  it("should return error message if location is invalid", async () => {
    await expect(
      program.parseAsync(["list", "--location", "wrong;$"], { from: "user" }),
    ).rejects.toThrow("process.exit called");
    expect(mockConsoleError).toHaveBeenCalledWith(
      "wrong;$ is not a valid location",
    );
  });

  it("should return error message if language is invalid", async () => {
    await expect(
      program.parseAsync(["list", "--language", "not@language"], {
        from: "user",
      }),
    ).rejects.toThrow("process.exit called");
    expect(mockConsoleError).toHaveBeenCalledWith(
      "not@language is not a valid language",
    );
  });
});
