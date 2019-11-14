import { TableDAL } from "./dal/tableDAL";

import { getConfig } from "./config";

const { sourceDataBase, targetDataBase } = getConfig();

async function syncTable(sourceTable: string, primaryKey: string, targetTable: string) {
  let pageIndex = 1;
  let copyCount = 0;
  let { pageSize, count, list } = await TableDAL.getTableData(sourceTable, primaryKey, pageIndex);
  copyCount += list.length;

  await TableDAL.replaceTable(targetTable, list);
  console.log(`复制了:${list.length}行`);

  while (pageIndex * pageSize < count) {
    pageIndex++;
    const res = await TableDAL.getTableData(sourceTable, primaryKey, pageIndex);
    copyCount += res.list.length;
    await TableDAL.replaceTable(targetTable, res.list);
    console.log(`复制了:${list.length}行`);
    count = res.count;
    pageSize = res.pageSize;
  }

  console.log(`处理完成，共复制了:${copyCount}行`);
}

async function syncTables() {
  for (let i = 0; i < sourceDataBase.tables.length; i++) {
    const sourceTable = sourceDataBase.tables[i];
    const primaryKey = sourceDataBase.primaryKeys[i];
    const targetTable = targetDataBase.tables[i];
    await syncTable(sourceTable, primaryKey, targetTable);
  }
}

syncTables()
  .then()
  .catch();
