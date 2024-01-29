import { Transaction } from "kysely-codegen";
import "dotenv/config";
import { findPendingTransactions } from "./db/direct-express-repository";
import { updateTransactionsFromTiller } from "./sheets/service";

updateTransactionsFromTiller();
