import { TableDAL } from "./dal/tableDAL";
import { getConfig } from "./config";
import { getTime } from "./utils/getTime";
import { ProgressBar } from "progress-i";

const { sourceDataBase, targetDataBase } = getConfig();

async function syncTable(sourceTable: string, primaryKey: string, targetTable: string) {
  let pageIndex = 1;
  let copyCount = 0;
  let { pageSize, count, list } = await TableDAL.getTableData(sourceTable, primaryKey, pageIndex);
  copyCount += list.length;

  const progress = new ProgressBar(`正在同步表 ${sourceTable}`, 30);
  progress.setTotal(count);

  await TableDAL.replaceTable(targetTable, list);
  progress.setValue(copyCount);

  while (pageIndex * pageSize < count) {
    pageIndex++;
    const res = await TableDAL.getTableData(sourceTable, primaryKey, pageIndex);
    copyCount += res.list.length;
    await TableDAL.replaceTable(targetTable, res.list);
    progress.setValue(copyCount);
    count = res.count;
    pageSize = res.pageSize;
  }
  progress.finish();
  console.log("\n");
}

async function syncTables() {
  for (let i = 0; i < sourceDataBase.tables.length; i++) {
    const sourceTable = sourceDataBase.tables[i];
    const primaryKey = sourceDataBase.primaryKeys[i];
    const targetTable = targetDataBase.tables[i];
    console.log(`${getTime()} 正在同步表${sourceTable}`);
    await syncTable(sourceTable, primaryKey, targetTable);
    console.log(`${getTime()} 表${sourceTable} 同步完成`);
  }
  console.log(`${getTime()} 同步完成`);
}

console.log(`${getTime()} 开始同步`);
syncTables()
  .then()
  .catch();
