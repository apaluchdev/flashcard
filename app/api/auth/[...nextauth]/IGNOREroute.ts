// import User, { IUser } from "@/models/User";
// import NextAuth from "next-auth/next";
// import GoogleProvider from "next-auth/providers/google";
// const handler = NextAuth({
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID ?? "",
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
//     }),
//   ],

//   callbacks: {
//     // Executes on initial authentication
//     async jwt({ token, account, profile }) {
//       const user = await User.findOne({ email: token.email });

//       if (user) {
//         token.username = user.username;
//       }
//       return token;
//     },
//     // Executes whenever a session is checked
//     async session({ session, token, user }) {
//       // Send properties to the client, like an access_token from a provider.
//       session.user.username = (token as any).username;
//       return session;
//     },
//   },
// });

// export { handler as GET, handler as POST };
