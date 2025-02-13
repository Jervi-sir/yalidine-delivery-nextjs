import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcrypt';
import { createClient as createSupabaseClient } from '@/database/postgresClient';
import { SupabaseClient } from '@supabase/supabase-js';
// Declare a global variable to hold the Supabase client
let supabase: SupabaseClient | null = null;
const handler = NextAuth({
  session: {
    strategy: 'jwt',
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
      async authorize(credentials, req) {
        try {
          // Initialize Supabase client only if it's not already initialized
          if (!supabase) {
            supabase = await createSupabaseClient();
          }

          const { data: users, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', credentials?.email)
            .limit(1);

          if (error) {
            console.error('Supabase error:', error);
            return null; // Or throw an error if you prefer
          }

          const user = users?.[0];

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
          console.log('reutnr null: ', );
          return null; // Incorrect password
        } catch (error: any) {
          console.error('Error during authorization:', error);
          return null; // Or throw an error
        }
      },
    }),
  ],
});

export { handler as GET, handler as POST };
