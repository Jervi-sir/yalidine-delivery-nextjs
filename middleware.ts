export { default } from 'next-auth/middleware';

export const config = { matcher: ['/dashboard', '/order/:path*', '/products/:path*'] };