/**
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* eslint-disable camelcase */
// [START sheets_quickstart]

import { OAuth2Client } from "google-auth-library";
import { authenticate } from "@google-cloud/local-auth";
import fs from "fs/promises";
import { google } from "googleapis";
import keys from "./credentials.json";
import path from "path";
import process from "process";

const TOKEN_PATH = path.join(process.cwd(), "token.json");

const TILLER_SHEET_ID = process.env.TILLER_SPREADSHEET_ID;
if (!TILLER_SHEET_ID) {
  throw new Error("TILLER_SHEET_ID not set");
}

/**
 * Load or request or authorization to call APIs.
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: "https://www.googleapis.com/auth/spreadsheets",
    keyfilePath: path.join(__dirname, "credentials.json"),
  });
  if (client?.credentials) {
    await saveCredentials(client);
  }
  return client;
}

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
async function getSheet(auth: OAuth2Client) {
  const sheets = google.sheets({ version: "v4", auth });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: TILLER_SHEET_ID,
    range: "Transactions",
  });
  const rows = res.data.values;
  if (!rows || rows.length === 0) {
    console.log("No data found.");
    return;
  }
  console.log(rows);
}

/**
 * Reads previously authorized credentials from the save file.
 */
async function loadSavedCredentialsIfExist(): Promise<OAuth2Client | null> {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content.toString());
    console.log(credentials);
    return google.auth.fromJSON(credentials) as OAuth2Client;
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 */
async function saveCredentials(client: OAuth2Client): Promise<void> {
  const { installed } = keys;
  const payload = JSON.stringify({
    type: "authorized_user",
    client_id: installed.client_id,
    client_secret: installed.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

(async function main() {
  const client = await authorize();
  await getSheet(client);
})();
