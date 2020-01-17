import { syncTables } from './syncTable';
import { yyyy_mm_dd_hh_mm_ss } from "yymmdd";

console.log(`${yyyy_mm_dd_hh_mm_ss()} 开始同步`);
syncTables()
  .then()
  .catch();
