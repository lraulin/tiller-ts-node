import { db } from "./database";

export async function findPendingTransactions() {
  return await db
    .selectFrom("direct_express")
    .where("date", ">=", "Pending")
    .selectAll()
    .execute();
}

export async function findClearedTransactions() {
  return await db
    .selectFrom("direct_express")
    .where("date", "==", "Pending")
    .selectAll()
    .execute();
}
