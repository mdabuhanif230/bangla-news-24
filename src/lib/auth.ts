import { betterAuth } from "better-auth";
import dns from "node:dns";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const mongoDnsServer = process.env.MONGODB_DNS_SERVER;
if (mongoDnsServer) dns.setServers([mongoDnsServer]);

const client = new MongoClient(process.env.MONGODB_URL as string);
const db = client.db("bangla-news-24");

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            overrideUserInfoOnSignIn: true,
          },
        }
      : {}),
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ? {
          github: {
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            overrideUserInfoOnSignIn: true,
          },
        }
      : {}),
  },
  account: {
    accountLinking: {
      updateUserInfoOnLink: true,
    },
  },
  database: mongodbAdapter(db, {
    client,
  }),
});
