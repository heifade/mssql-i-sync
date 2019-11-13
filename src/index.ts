import { TableDAL } from "./dal/tableDAL";

import { getConfig } from "./config";

const { sourceDataBase, targetDataBase } = getConfig();

async function syncData() {
  for (let i = 0; i < sourceDataBase.tables.length; i++) {
    const sourceTable = sourceDataBase.tables[i];
    const targetTable = targetDataBase.tables[i];

    const dataList = await TableDAL.getTableData(sourceTable);

    await TableDAL.replaceTable(targetTable, dataList);
  }
}

syncData()
  .then()
  .catch();
