import { db } from "../db/database";
import api from "./api";
import { Account, Transaction } from "kysely-codegen";
import "dotenv/config";
import {
  findAccounts,
  findCategories,
  insertTransactions,
} from "../db/transaction-repository";
import { TillerTransactionRow } from "./transactions";
import { InsertObjectOrList } from "kysely/dist/cjs/parser/insert-values-parser";
import { money } from "../common/util";

type Lookup = Record<string, number>;

async function getAccountLookup(): Promise<Lookup> {
  const accounts = await findAccounts();
  const accountlookup = accounts.reduce(
    (accumulator: Lookup, account: { name: string; id: number }) => {
      accumulator[account.name] = account.id;
      return accumulator;
    },
    {} as Lookup
  );
  return accountlookup;
}

async function getCategoryLookup(): Promise<Lookup> {
  const categories = await findCategories();
  const categoryLookup = categories.reduce((acc, category) => {
    acc[category.name] = category.id;
    return acc;
  }, {} as Lookup);
  return categoryLookup;
}

export async function updateTransactionsFromTiller() {
  const data = await api.getTransactionSheet();
  data.reverse();

  const accountLookup = await getAccountLookup();
  const categoryLookup = await getCategoryLookup();

  insertTransactions(
    data.map((r) => ({
      date: r[0],
      description: r[1],
      category_id: categoryLookup[r[2]],
      amount: money(r[3]),
      account_id: accountLookup[r[4]],
      check_number: r[11],
      full_description: r[12],
      date_added: r[13],
      categorized_date: r[14] || null,
      tiller_id: r[9],
    }))
  );
}
