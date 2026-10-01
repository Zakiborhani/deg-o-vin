import type { NextConfig } from "next";

const QOPLA_ORDER_URL = "https://qopla.com/restaurant/deg-och-vin/qMbRR7pDXd/order";

// Old WordPress URLs on degovin.se, mapped to their counterparts on the new site.
// Each source matches the bare path, a trailing slash, and anything underneath it.
const legacyRedirects: Record<string, string> = {
  "/book-a-table": "/#dv-book",
  "/food-menu": "/#dv-menu",
  "/drinks-menu": "/#dv-menu",
  "/about-us": "/#dv-about",
  "/privacy-policy": "/integritetspolicy",
  "/shop": "/",
  "/cart": "/",
  "/checkout": "/",
  "/my-account": "/",
  "/author": "/",
  "/feed": "/",
};

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // order.degovin.se was the old online-ordering site and still gets search traffic.
      // Temporary (307) so a change of ordering provider isn't cached by browsers forever.
      {
        source: "/:path*",
        has: [{ type: "host", value: "order.degovin.se" }],
        destination: QOPLA_ORDER_URL,
        permanent: false,
      },
      ...Object.entries(legacyRedirects).map(([source, destination]) => ({
        source: `${source}/:rest*`,
        destination,
        permanent: true,
      })),
    ];
  },
};

export default nextConfig;
