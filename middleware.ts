export { default } from "next-auth/middleware"

export const config = {
  matcher: ["/editor/:path*", "/dashboard/:path*"], // protect these routes
}
