import { InsertQueryBuilder } from "kysely";
import { db } from "./database";
import { DB, Transaction } from "kysely-codegen";
import { InsertObjectOrList } from "kysely/dist/cjs/parser/insert-values-parser";

export async function findCategories() {
  return await db.selectFrom("category").selectAll().execute();
}

export async function findAccounts() {
  return await db.selectFrom("account").selectAll().execute();
}

export async function findTransactions() {
  return await db.selectFrom("transaction").selectAll().execute();
}

export async function insertTransactions(
  transactions: InsertObjectOrList<DB, "transaction">
) {
  return await db
    .insertInto("transaction")
    .values(transactions)
    .onConflict((oc) => oc.doNothing())
    .execute();
}
