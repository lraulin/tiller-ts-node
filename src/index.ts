import api from "./sheets/api";

type TransactionSheetRow = []

(async () => {
  const transactions = await api.getTransactionSheet();
  console.log(transactions);
})();
