import client from "@/lib/db";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { Adapter } from "next-auth/adapters";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

const getClient = async () => {
  return client;
};

const handler = NextAuth({
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
});

export { handler as GET, handler as POST };
