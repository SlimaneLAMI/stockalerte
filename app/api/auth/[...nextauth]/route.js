import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId:     process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email:    { label: 'Email',    type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        await connectDB();
        const user = await User.findOne({ email: credentials.email }).select('+password');

        if (!user || !user.password) return null;
        const valid = await user.comparePassword(credentials.password);
        if (!valid) return null;
        if (user.isSuspended) throw new Error('Account suspended');

        await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });

        return {
          id:    user._id.toString(),
          name:  user.name,
          email: user.email,
          image: user.image,
          role:  user.role,
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        await connectDB();
        const existing = await User.findOne({ email: user.email });
        if (!existing) {
          await User.create({
            name:       user.name,
            email:      user.email,
            image:      user.image,
            provider:   'google',
            isVerified: true,
            role:       'client',
          });
        } else if (existing.isSuspended) {
          return false;
        } else {
          await User.findByIdAndUpdate(existing._id, { lastLogin: new Date() });
        }
      }
      return true;
    },

    async jwt({ token, user, trigger, session }) {
      if (user) {
        await connectDB();
        const dbUser = await User.findOne({ email: token.email });
        if (dbUser) {
          token.id   = dbUser._id.toString();
          token.role = dbUser.role;
        }
      }
      if (trigger === 'update' && session?.role) {
        token.role = session.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id   = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },

  pages: {
    signIn:  '/fr/auth/login',
    error:   '/fr/auth/error',
  },

  session: { strategy: 'jwt' },
  secret:  process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
