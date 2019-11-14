import { readFileSync } from "fs";
import { resolve } from "path";

let configCacle: Config = null;

interface Config {
  pageSize: number;
  sourceDataBase: {
    server: string;
    port: number;
    user: string;
    password: string;
    database: string;
    tables: string[];
    primaryKeys: string[];
    connectionTimeout: number;
  };
  targetDataBase: {
    server: string;
    port: number;
    user: string;
    password: string;
    database: string;
    tables: string[];
    connectionTimeout: number;
  };
}

export function getConfig(): Config {
  if (!configCacle) {
    const configFile = resolve(__dirname, "./config.json");
    configCacle = JSON.parse(readFileSync(configFile, { encoding: "utf-8" }));
  }

  return configCacle;
}
