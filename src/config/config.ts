import { configDotenv } from "dotenv";

export type CliConfig = {
  db: {
    host: string;
    port: number;
    username: string;
    password: string;
    name: string;
  };
  github: {
    token: string;
  };
};

export const config = () => {
  configDotenv();

  const config: CliConfig = {
    db: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      name: process.env.DB_NAME,
    },
    github: {
      token: process.env.GITHUB_TOKEN || "",
    },
  };

  return config;
};
