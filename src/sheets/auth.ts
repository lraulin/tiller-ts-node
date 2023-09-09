import { OAuth2Client } from "google-auth-library";
import { authenticate } from "@google-cloud/local-auth";
import fs from "fs/promises";
import { google } from "googleapis";
import keys from "../credentials.json";
import path from "path";
import process from "process";

const TOKEN_PATH = path.join(process.cwd(), "token.json");

export default async function authorize() {
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
