import { expect } from "chai";
import "mocha";
import { syncTables } from "../src/syncTable";
import { Exec, ConnectionHelper, Select, ConnectionPool } from "mssql-i";
import { getConfig } from "../src/config";
import { yyyy_mm_dd } from "yymmdd";
import { des } from "../src/utils/des";

const { targetDataBase, sourceDataBase } = getConfig();
let targetConn: ConnectionPool;
let sourceConn: ConnectionPool;
let sourceUpdateDt = yyyy_mm_dd();

describe("syncTables", function() {
  before(async () => {
    targetConn = await ConnectionHelper.create(targetDataBase);
    sourceConn = await ConnectionHelper.create(sourceDataBase);
    for (const table of targetDataBase.tables) {
      await Exec.exec(targetConn, `delete from ${table}`);
    }

    for (const table of sourceDataBase.tables) {
      await Exec.exec(sourceConn, `update ${table} set updateDate = '${sourceUpdateDt}'`);
    }
  });

  after(async () => {
    await ConnectionHelper.close(targetConn);
    await ConnectionHelper.close(sourceConn);
  });

  it("sync ", async () => {
    // 目标库为空
    for (const table of targetDataBase.tables) {
      const count = await Select.selectCount(targetConn, { sql: `select * from ${table}` });
      expect(count).to.equal(0);
    }
    // 同步
    await syncTables();

    // 目标库与源库相同
    for (const table of targetDataBase.tables) {
      const targetCount = await Select.selectCount(targetConn, { sql: `select * from ${table}` });
      const sourceCount = await Select.selectCount(sourceConn, { sql: `select * from ${table}` });
      expect(targetCount).to.equal(sourceCount);
    }
  });

  it("sync2 ", async () => {
    const dt = "1900-01-01";

    // 目标库 updateDate 全是 sourceUpdateDt
    for (const table of targetDataBase.tables) {
      const count = await Select.selectCount(targetConn, { sql: `select * from ${table} where updateDate = '${dt}'` });
      expect(count).to.equal(0);
    }

    // 更新目标表
    for (const table of targetDataBase.tables) {
      await Exec.exec(targetConn, `update ${table} set updateDate = '${dt}'`);
    }

    // 目标表的 updateDate 已改，且数量与 源表一致
    for (const table of targetDataBase.tables) {
      const targetCount = await Select.selectCount(targetConn, { sql: `select * from ${table} where updateDate = '${dt}'` });
      const sourceCount = await Select.selectCount(sourceConn, { sql: `select * from ${table}` });
      expect(targetCount).to.equal(sourceCount);
      expect(targetCount).to.gt(0);
    }

    // 同步
    await syncTables();

    // 目标库与源库相同
    for (const table of targetDataBase.tables) {
      const targetCount = await Select.selectCount(targetConn, { sql: `select * from ${table} where updateDate = '${sourceUpdateDt}'` });
      const sourceCount = await Select.selectCount(sourceConn, { sql: `select * from ${table}` });
      expect(targetCount).to.equal(sourceCount);
      expect(targetCount).to.gt(0);
    }
  });
});
