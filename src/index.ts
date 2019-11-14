import { TableDAL } from "./dal/tableDAL";
import { getConfig } from "./config";
import * as chalk from "chalk";
import { getTime } from "./utils/getTime";

const { sourceDataBase, targetDataBase } = getConfig();

async function syncTable(sourceTable: string, primaryKey: string, targetTable: string) {
  let pageIndex = 1;
  let copyCount = 0;
  let { pageSize, count, list } = await TableDAL.getTableData(sourceTable, primaryKey, pageIndex);
  copyCount += list.length;

  await TableDAL.replaceTable(targetTable, list);
  console.log(`${getTime()} 表${sourceTable} 同步了${copyCount}行，完成${(copyCount / count).toFixed(0)}%`);

  while (pageIndex * pageSize < count) {
    pageIndex++;
    const res = await TableDAL.getTableData(sourceTable, primaryKey, pageIndex);
    copyCount += res.list.length;
    await TableDAL.replaceTable(targetTable, res.list);
    console.log(`${getTime()} 表${sourceTable} 同步了${copyCount}行，完成${(copyCount / count).toFixed(0)}%`);
    count = res.count;
    pageSize = res.pageSize;
  }

  console.log(chalk.green(`${getTime()} 表${sourceTable} 同步完成，共${copyCount}行`));
}

async function syncTables() {
  for (let i = 0; i < sourceDataBase.tables.length; i++) {
    const sourceTable = sourceDataBase.tables[i];
    const primaryKey = sourceDataBase.primaryKeys[i];
    const targetTable = targetDataBase.tables[i];
    console.log(`${getTime()} 正在同步表${sourceTable} => ${targetTable}`);
    await syncTable(sourceTable, primaryKey, targetTable);
  }
  console.log(`${getTime()} 同步完成`);
}

console.log(`${getTime()} 开始同步`);
syncTables()
  .then()
  .catch();
