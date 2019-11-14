import { ConnectionHelper, Select, Replace } from "mssql-i";
import { getConfig } from "../config";

export class TableDAL {
  public static async getTableData(tableName: string, primaryKey: string, pageIndex: number) {
    let conn;
    try {
      const { sourceDataBase, pageSize } = getConfig();
      conn = await ConnectionHelper.create(sourceDataBase);

      const sql = `select *, row_number() over(order by ${primaryKey}) as row_number from ${tableName}`;
      console.log('select', sql);

      const spRes = await Select.selectSplitPage(conn, {
        sql,
        pageSize,
        index: pageIndex
      });
      console.log('select finish', spRes.count);

      return {
        ...spRes,
        pageSize
      };
    } catch (e) {
      throw e;
    } finally {
      await ConnectionHelper.close(conn);
    }
  }

  public static async replaceTable(tableName: string, list: any[]) {
    let conn;
    try {
      const { targetDataBase } = getConfig();
      conn = await ConnectionHelper.create(targetDataBase);
      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        console.log('replace', item.id);
        await Replace.replace(conn, {
          data: item,
          table: tableName
        });
        console.log('replace finish', item.id);
      }
    } catch (e) {
      throw e;
    } finally {
      await ConnectionHelper.close(conn);
    }
  }
}
