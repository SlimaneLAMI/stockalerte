import { withAuth } from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized({ token }) {
      return !!token;
    },
  },
  pages: {
    signIn: '/admin/login',
  },
});

export const config = {
  matcher: ['/admin/:path*'],
};
