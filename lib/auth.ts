import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { AuthOptions } from "next-auth";
import { Adapter } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";
import client from "./db";

const getClient = async () => {
  return client;
};

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt", // Explicit strategy required for Credentials provider
  },
  adapter: MongoDBAdapter(getClient()) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],

  callbacks: {
    // Executes on initial authentication
    async jwt({ user, token }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    },
    // Executes whenever a session is checked
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id, // Getting the user id available into the session: Database id into the JWT, then into session from the JWT
          name: token.name,
        },
      };
    },
  },
};
