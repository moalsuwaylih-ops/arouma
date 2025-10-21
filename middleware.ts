export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/assessment/:path*", "/results/:path*"], // أي مسارات تريد حمايتها
};
