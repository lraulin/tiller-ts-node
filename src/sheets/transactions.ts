interface TillerTransactionRow {
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
  const [
    date,
    description,
    category,
    amount,
    account,
    accountNumber,
    institution,
    transactionId,
    accountId,
    checkNumber,
    fullDescription,
    dateAdded,
    categorizedDate,
  ] = row;
  return {
    date: new Date(date),
    description,
    category,
    amount: money(amount),
    account,
    accountNumber,
    institution,
    transactionId,
    accountId,
    checkNumber: checkNumber === "" ? null : Number.parseInt(checkNumber),
    fullDescription,
    dateAdded: new Date(dateAdded),
    categorizedDate: categorizedDate == "" ? null : new Date(categorizedDate),
  };
};

export default { parseRow };
