export interface TillerTransactionRow {
  date: Date;
  description: string;
  category: string;
  amount: number;
  account: string;
  accountNumber: string;
  institution: string;
  transactionId: string;
  accountId: string;
  checkNumber: number | null;
  fullDescription: string;
  dateAdded: Date;
  categorizedDate: Date | null;
}

const money = (s: string) => Number.parseFloat(s.replace(/[$,]/, ""));

const parseRow = (row: string[]): TillerTransactionRow => {
  return {
    date: new Date(row[0]),
    description: row[1],
    category: row[2],
    amount: money(row[3]),
    account: row[4],
    accountNumber: row[5],
    institution: row[6],
    transactionId: row[9],
    accountId: row[10],
    checkNumber: row[11] === "" ? null : Number.parseInt(row[11], 10),
    fullDescription: row[12],
    dateAdded: new Date(row[13]),
    categorizedDate: row[14] == "" ? null : new Date(row[14]),
  };
};

export default { parseRow };
