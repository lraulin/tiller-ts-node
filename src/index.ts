import "dotenv/config";
import { findPendingTransactions } from "./db/direct-express-repository";
import api from "./sheets/api";
import trans from "./sheets/transactions";

(async () => {
  const rows = await api.getTransactionSheet();

  if (!rows) {
    console.log("No data found.");
    return;
  }

  const transactions = rows.map(trans.parseRow);
  console.log(transactions);

  console.log("-------------------t");
  const pending = await findPendingTransactions();
  console.log(pending);
})();
