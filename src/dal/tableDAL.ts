import { ConnectionHelper, Select, Replace } from "mssql-i";
import { getConfig } from "../config";

export class TableDAL {
  public static async getTableData(tableName: string, primaryKey: string, pageIndex: number) {
    let conn;
    try {
      const { sourceDataBase, pageSize } = getConfig();
      conn = await ConnectionHelper.create(sourceDataBase);

      const sql = `select *, row_number() over(order by ${primaryKey}) as row_number from ${tableName} with(nolock)`;

      const spRes = await Select.selectSplitPage(conn, {
        sql,
        pageSize,
        index: pageIndex
      });

      return {
        ...spRes,
        pageSize
      };
    } catch (e) {
      throw e;
    } finally {
      await ConnectionHelper.close(conn);
      await ConnectionHelper.closePool();
    }
  }

  public static async replaceTable(tableName: string, list: any[]) {
    let conn;
    try {
      const { targetDataBase } = getConfig();
      conn = await ConnectionHelper.create(targetDataBase);
      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        await Replace.replace(conn, {
          data: item,
          table: tableName
        });
      }
    } catch (e) {
      throw e;
    } finally {
      await ConnectionHelper.close(conn);
      await ConnectionHelper.closePool();
    }
  }
}
