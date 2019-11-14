import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import * as chalk from "chalk";
import { des } from "../utils/des";
import { KEY } from "../generateKey";

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
    requestTimeout: number;
  };
  targetDataBase: {
    server: string;
    port: number;
    user: string;
    password: string;
    database: string;
    tables: string[];
    connectionTimeout: number;
    requestTimeout: number;
  };
}

export function getConfig(): Config {
  if (!configCacle) {
    const configFile = resolve(process.cwd(), "./config.json");

    if (!existsSync(configFile)) {
      const errorText = chalk.red(`配置文件${configFile}不存在！`);
      console.log(errorText);
      throw new Error(errorText);
    }

    configCacle = JSON.parse(readFileSync(configFile, { encoding: "utf-8" }));

    configCacle.sourceDataBase.password = des.decryptStr(configCacle.sourceDataBase.password, KEY);
    configCacle.targetDataBase.password = des.decryptStr(configCacle.targetDataBase.password, KEY);
  }

  return configCacle;
}
