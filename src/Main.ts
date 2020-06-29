import { Client } from "@typeit/discord";
import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";

config();


export class Main {
  private static _client: Client;
  private static _prisma: PrismaClient;

  static get Client(): Client {
    return this._client;
  }

  static get prisma(): PrismaClient {
    return this._prisma;
  }

  static start() {
    this._client = new Client();
    this._prisma = new PrismaClient();
    if (!process.env.DISCORD_TOKEN) throw new Error("discord Token not present as an environment variable")

    // In the login method, you must specify the glob string to load your classes (for the framework).
    // In this case that's not necessary because the entry point of your application is this file.
    this._client.login(
      process.env.DISCORD_TOKEN,
      `${ __dirname }/discords/*.ts`, // glob string to load the classes
      `${ __dirname }/discords/*.js` // If you compile your bot, the file extension will be .js
    );
  }
}

Main.start();
