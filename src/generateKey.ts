import { des } from "./utils/des";
import { blue, red } from "chalk";
import * as commander from "commander";

export const KEY = "<,((;0]7&65^0&8/*-+'\";[N";

commander
  .option("--text <n>", `需要加密的内容。${red("注意：如有特殊字符，需要用单引号括起来，如：'123!56'")}`, "")
  .description("用des算法加密文本内容，并用base64编码返回")
  .action((pars: any) => {
    let enc = des.encryptStr(pars.text, KEY);
    console.log(`加密结果为：${blue(enc)}`);
  });

commander.parse(process.argv);
