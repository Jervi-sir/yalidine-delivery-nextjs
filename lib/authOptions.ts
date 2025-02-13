import prisma from "@/prisma/prisma";
import NextAuth, { SessionStrategy } from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcrypt';

export const authOptions = NextAuth({
  session: {
    strategy: 'jwt' as SessionStrategy
  },
  pages: {
    signIn: '/auth/login',
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        try {
          const user = await prisma.user.findUnique({
            where: {
              email: credentials?.email,
            },
          });

          if (!user) {
            return null; // User not found
          }

          const passwordCorrect = await compare(
            credentials?.password || '',
            user.password
          );

          console.log({ passwordCorrect });

          if (passwordCorrect) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
            };
          }
          return null; 
        } catch (error) {
          console.error('Error during authorization:', error);
          return null; // Or throw an error
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Persist the userId and other properties to the token even on sign in
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    },
    // async session({ session, token }) {
    //   // Send properties to the client, like an ID
    //   session.user.id = token.sub as string;
    //   session.user.name = token.name;
    //   session.user.email = token.email;
    //   console.log('session: ', session);
    //   return session;
    // },
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub,
      },
    }),

  },
});