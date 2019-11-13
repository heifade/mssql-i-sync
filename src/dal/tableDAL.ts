import { ConnectionHelper, Select, Replace } from "mssql-i";
import { getConfig } from "../config";

export class TableDAL {
  public static async getTableData(tableName: string) {
    let conn;
    try {
      conn = await ConnectionHelper.create(getConfig().sourceDataBase);

      return await Select.select(conn, {
        sql: `select * from ${tableName} with(nolock)`
      });
    } catch (e) {
      throw e;
    } finally {
      await ConnectionHelper.close(conn);
    }
  }

  public static async replaceTable(tableName: string, list: any[]) {
    let conn;
    try {
      conn = await ConnectionHelper.create(getConfig().targetDataBase);
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
    }
  }
}
